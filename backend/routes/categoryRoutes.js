import express from "express";
import prisma from "../prismaClient.js";
import autenticarUsuario from "../middlewares/authMiddleware.js";
import validarCategoria from "../middlewares/categoryMiddleware.js";

const router = express.Router();

router.get("/categories", autenticarUsuario,  async (req, res) => {
  try {
    const categorias = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(categorias);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "erro ao buscar categorias",
    });
  }
});

router.post("/categories", autenticarUsuario,  validarCategoria, async (req, res) => {
  try {
    const { nome } = req.body;
    const categoriaExistente = await prisma.category.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: "insensitive",
        },
      },
    });

    if (categoriaExistente) {
      return res.status(409).json({
        message: "nome da categoria já existe",
      });
    }

    const inserirCat = await prisma.category.create({
      data: {
        nome: nome,
      },
    });

    res.status(201).json(inserirCat);
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Nome da categoria já existe",
      });
    }

    res.status(500).json({
      message: "Erro ao criar categoria",
    });
  }
});

router.get("/categories/:id",autenticarUsuario, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const categorias = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!categorias) {
      return res.status(404).json({
        message: "id da categoria não existe",
      });
    }

    res.json(categorias);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erro ao buscar categoria",
    });
  }
});

router.put("/categories/:id",autenticarUsuario, validarCategoria, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const idCat = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!idCat) {
      return res.status(404).json({
        message: "O id da categoria nao existe",
      });
    }

    //achar mesmo nome de categoria em um id diferente para não permitir atualização
    const categoriaExistente = await prisma.category.findFirst({
      where: {
        nome: {
          equals: req.body.nome,
          mode: "insensitive",
          //ache um objeto com o mesmo nome de categoria passado no req.body
        },
        NOT: {
          //que não tenha esse mesmo id do objeto atual
          id: id,
        },
      },
    });
    if (categoriaExistente) {
      //se já existe um objeto com a mesma categoria, impede a atualização
      return res.status(409).json({
        message: "Nome da categoria ja existe",
      });
    }

    const atualizarCat = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        nome: req.body.nome,
      },
    });

    res.status(201).json(atualizarCat);
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Nome da categoria ja existe",
      });
    }

    res.status(500).json({
      message: "Erro ao atualizar categoria",
    });
  }
});

router.delete("/categories/:id", autenticarUsuario, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const findCat = await prisma.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!findCat) {
      return res.status(400).json({
        message: "Id da categoria não existe",
      });
    }

    const delCat = await prisma.category.delete({
      where: {
        id: id,
      },
    });

    return res.json(delCat);
  } catch (error) {
    console.error(error);

    if(error.code === "P2003"){
      return res.status(400).json({
        message: "A categoria não pode ser excluída pois possui produtos associados"
      })
    }

    return res.status(500).json({
      message: "Houve um erro de requisição",
    });
  }
});






export default router;