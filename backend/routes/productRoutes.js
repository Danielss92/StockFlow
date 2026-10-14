import express from "express";
import prisma from "../prismaClient.js";
import autenticarUsuario from "../middlewares/authMiddleware.js";
import validarProduto from "../middlewares/produtoMiddleware.js";
const router = express.Router();

router.post("/produtos",autenticarUsuario, validarProduto, async (req, res) => {
  try {
    const {
      nome,
      preco,
      quantidadeEstoque,
      minimoEstoque,
      criadoEm,
      categoryId,
    } = req.body; 

    const categoria = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!categoria) {
      return res.status(404).json({
        message: "Categoria nao encontrada",
      });
    }
    //CRIAÇÃO DE PRODUTO

    const novoProduto = await prisma.produto.create({
      data: {
        nome: nome,
        preco: preco,
        quantidadeEstoque: quantidadeEstoque,
        minimoEstoque: minimoEstoque,

        categoryId: categoryId,
      },
    });

    return res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "A categoria informada não é valida",
      });
    }
  }

  return res.status(500).json({
    message: "Erro ao criar produto!",
  });
});

//listar produtos
router.get("/produtos", autenticarUsuario, async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        category: true,
      },
    });
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao buscar produtos",
    });
  }
});

router.get("/produtos/:id",autenticarUsuario, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const produto = await prisma.produto.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
      }
    });

    if (!produto) {
      return res.status(404).json({
        message: "Produto nao encontrado",
      });
    }

    res.json(produto);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao buscar produto",
    });
  }
});

router.put("/produtos/:id", autenticarUsuario,  validarProduto, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "O id do produto deve ser um número inteiro maior que 0",
      });
    }
    const produto = await prisma.produto.findUnique({
      where: {
        id: id,
      },
    });

    if (!produto) {
      return res.status(404).json({
        message: "Produto nao encontrado",
      });
    }

    const categoria = await prisma.category.findUnique({
      where: {
        id: req.body.categoryId,
      },
    });
    if (!categoria) {
      return res.status(404).json({
        message: "Categoria nao encontrada",
      });
    }

    const updateProduto = await prisma.produto.update({
      where: {
        id: id,
      },
      data: {
        nome: req.body.nome,
        preco: req.body.preco,
        quantidadeEstoque: req.body.quantidadeEstoque,
        minimoEstoque: req.body.minimoEstoque,
        categoryId: req.body.categoryId,
      },
    });

    res.json(updateProduto);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao atualizar o produto",
    });
  }
});

router.delete("/produtos/:id", autenticarUsuario, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const produto = await prisma.produto.findUnique({
      where: {
        id: id,
      },
    });

    if (!produto) {
      return res.status(404).json({
        message: "Produto nao encontrado",
      });
    }

    const produtoDeletado = await prisma.produto.delete({
      where: {
        id: id,
      },
    });

    res.json(produtoDeletado);
  } catch (error) {
    console.error(error);

    if(error.code === "P2003"){
      return res.status(400).json({
        message: "Não é possível excluir este produto porque ele possui vendas associadas",
      });
    }
    res.status(500).json({
      message: "Houve um problema ao tentar deletar o produto",
    });
  }
});






export default router;