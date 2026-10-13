import express from "express";
import prisma from "../prismaClient.js";
import autenticarUsuario from "../middlewares/authMiddleware.js";
import validarVenda from "../middlewares/saleMiddleware.js";

const router = express.Router();

router.post("/sales", autenticarUsuario, validarVenda, async (req, res) => {
  try {
    const { itens } = req.body;

    for (const item of itens) {
      //percorrer cada um dos itens que estão no array itens

      const produto = await prisma.produto.findUnique({
        where: {
          id: item.produtoId, // verifica se o id que está no produto dentro de itens corresponde a um id dentro da tabela produtos. Verifica se existe um produto com o mesmo id
        },
      });

      if (!produto) {
        return res.status(404).json({
          message: `Produto com o id ${item.produtoId} não encontrado`, // se nao existe um produto com esse id, um item de venda nao pode ser criado com esse id
        });
      }

      if (produto.quantidadeEstoque < item.quantidade) {
        // se o estoque do produto relacionado a esse id for menor que a quantidade definida no itens.body na requisição

        return res.status(400).json({
          message: `Estoque insuficiente para o produto ${produto.nome}`,
        });
      }
    }

    const novaVenda = await prisma.$transaction(async (tx) => {
      //mesma transação

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

    //const novaVenda = await prisma.sale.create({

    /* data: {
        //a id da sale e a data são criados automaticamente
        itens: {
          //percorre todos os itens que fazem parte daquela venda. itens é um atributo de Sale que possui outros atributo dentro como produtoId e quantidade
          create: itens.map((item) => ({
            produtoId: item.produtoId, //pega o atributo produto id e a quantidade do SaleItem e passa o valor colocado no body
            quantidade: item.quantidade,
          })),
        },
      },
      include: {
        itens: true, // o include fará a API devolver os itens junto com a venda
      }
    });*/

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
        //Além da Sale, também quero que você busque os registros relacionados. Sem include o Prisma busca somente os campos da tabela Sale(id e criadoEm)
        itens: {
          include: {
            produto: true,

            //itens e produtos sao de tabelas separadas por isso o uso do include
            //include não cria o relacionamento. Ele diz quais relacionamentos existentes você quer trazer junto na consulta.
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
      }, // sem o include retornariam apenas o id da venda e a data, com ele será retornado tambem o SaleItem com id do produto e a quantidade
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
        //Depois que a venda é cancelada, a quantidade de produtos precisa voltar para o estoque

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

    //para deletar automaticamente os saleItens que estão dentro do sale, quando se deleta uma sale, no banco deveria ser
    //usado no schema OnDelete: cascade:
    /*
      sale Sale @relation(
    fields: [saleId],
    references: [id],
    onDelete: Cascade
    )   
   
   */

   
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao excluir venda",
    });
  }
  //
});

export default router;
