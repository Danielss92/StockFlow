
import validarUsuario from "../validators/userValidators.js";

function validarNovoUsuario(req, res, next){

   

    const resultado = validarUsuario(req.body.nome, req.body.email, req.body.senha);

   

    if(!resultado.valido){
        return res.status(400).json({
            message: resultado.mensagem
        })
    }

        
         req.body.nome = resultado.nome;
         req.body.email = resultado.email;
         req.body.senha = resultado.senha;

    
   


    next()



}

export default validarNovoUsuario;