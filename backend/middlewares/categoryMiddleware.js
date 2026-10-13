import validarNomeCategoria from "../validators/categoryValidators.js";

//middleware de validação de categoria

function validarCategoria(req, res, next){
    const resultado = validarNomeCategoria(req.body.nome);

    if(!resultado.valido){
        return res.status(400).json({

            message: resultado.mensagem
        })
    }

    req.body.nome = resultado.nome

    next()
}

export default validarCategoria;