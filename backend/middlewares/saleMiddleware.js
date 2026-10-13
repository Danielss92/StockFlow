
import validarItensVenda from "../validators/saleValidators.js";

function validarVenda(req, res, next){
    const resultado = validarItensVenda(req.body.itens);

    if(!resultado.valido){
        return res.status(400).json({
            message: resultado.mensagem
        })
    }

    next();
}

export default  validarVenda;