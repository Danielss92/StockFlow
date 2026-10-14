import express from "express";
import prisma from "../prismaClient.js";
import autenticarUsuario from "../middlewares/authMiddleware.js";
import validarVenda from "../middlewares/saleMiddleware.js";

const router = express.Router();

router.post("/sales", autenticarUsuario, validarVenda, async (req, res) => {
  try {
    const { itens } = req.body;

    for (const item of itens) {
     

      const produto = await prisma.produto.findUnique({
        where: {
          id: item.produtoId, 
        },
      });

      if (!produto) {
        return res.status(404).json({
          message: `Produto com o id ${item.produtoId} não encontrado`, 
        });
      }

      if (produto.quantidadeEstoque < item.quantidade) {
       

        return res.status(400).json({
          message: `Estoque insuficiente para o produto ${produto.nome}`,
        });
      }
    }

    const novaVenda = await prisma.$transaction(async (tx) => {
      

      //criar venda
      const venda = await tx.sale.create({
        data: {
          itens: {
            create: itens.map((item) => ({
              produtoId: item.produtoId,
              quantidade: item.quantidade,
            })),
          },
        },
        include: {
          itens: true,
        },
      });

      //atualiza o produto decrementando o valor da quantidade do estoque
      for (const item of itens) {
        await tx.produto.update({
          where: {
            id: item.produtoId,
          },
          data: {
            quantidadeEstoque: {
              decrement: item.quantidade,
            },
          },
        });
      }

      return venda;
    });

   

    res.status(201).json(novaVenda);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Erro ao criar venda",
    });
  }
});

router.get("/sales", autenticarUsuario,  async (req, res) => {
  try {
    const vendas = await prisma.sale.findMany({
      include: {
       
        itens: {
          include: {
            produto: true,

          },
        },
      },
    });
    res.json(vendas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao buscar vendas",
    });
  }
});

router.get("/sales/:id", autenticarUsuario, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id || id < 1)) {
      return res.status(400).json({
        message: "O id da venda deve ser um número inteiro maior que 0",
      });
    }
    const venda = await prisma.sale.findUnique({
      where: {
        id: id,
      },
      include: {
        itens: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!venda) {
      return res.status(404).json({
        message: "Venda nao encontrada",
      });
    }

    res.json(venda);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao buscar venda",
    });
  }
});


router.delete("/sales/:id", autenticarUsuario, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const venda = await prisma.sale.findUnique({
      where: {
        id: id,
      },
      include: {
        itens: true,
      }, 
    });

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "O id da venda deve ser um número inteiro maior que 0",
      });
    }

    if (!venda) {
      return res.status(404).json({
        message: "Venda não encontrada",
      });
    }

    await prisma.$transaction(async (tx) => {
      for (const item of venda.itens) {
       

        await tx.produto.update({
          where: {
            id: item.produtoId,
          },
          data: {
            quantidadeEstoque:{
               increment: item.quantidade
            }
           
          }
        });
      }
      await tx.saleItem.deleteMany({
        where: {
          saleId: id,
        }
      });
      await tx.sale.delete({
        where: {
          id: id
        },
      });
    });
    res.json({
      message: "Venda excluída com sucesso",
    });

   
   
   

   
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao excluir venda",
    });
  }
  
});

export default router;
