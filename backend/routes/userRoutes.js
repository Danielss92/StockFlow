import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";
import validarNovoUsuario from "../middlewares/userMiddleware.js";

const router = express.Router();

//criar usuario
router.post("/users",validarNovoUsuario, async(req, res)=>{

  try{

    const {nome, email, senha} = req.body;


     const usuarioExistente = await prisma.user.findUnique({
      where:{
        email: email
      }
     })

     if(usuarioExistente){
      return res.status(409).json({
        message: "O email já está cadastrado"
      })
     }

     const senhaHash = await bcrypt.hash(senha, 10);

     const novoUsuario = await prisma.user.create({
         data:{
          nome: nome,
          email: email,
          senha: senhaHash
         }
     })



     res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email
     })


  }catch(error){
    console.error(error);
    res.status(500).json({
      message: "Erro ao criar usuario"
    })
  }

})

//fazer login
router.post("/login", async (req, res)=>{

  try{  

    const {email, senha} = req.body;

    const usuario = await prisma.user.findUnique({
      where:{
        email: email
      }
    })

    if(!usuario){
      return res.status(401).json({
        message: "Email ou senha inválidos"
      })
    }

      if(!usuario){
      return res.status(401).json({
        message: "Email ou senha inválidos"
      })
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if(!senhaCorreta){
      return res.status(401).json({
        message: "Email ou senha inválidos"
      })
    }

    const token = jwt.sign(
      {id: usuario.id},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    )

    res.json({
      message: "Login realizado com sucesso",
      token: token
    })


  }catch(error){

    console.error(error);

    res.status(500).json({
      message: "Erro ao fazer login"
    })

  }

})

export default router;
