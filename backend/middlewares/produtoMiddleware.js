
import validarNomeProduto from "../validators/productValidators.js";



function validarProduto(req, res, next) {


    
    const resultado = validarNomeProduto(req.body.nome, req.body.preco, req.body.quantidadeEstoque, req.body.minimoEstoque, 
        req.body.categoryId)

     
    if (!resultado.valido) {
        return res.status(400).json({
            message: resultado.mensagem
        })
    }

    

    req.body.nome = resultado.nome
    req.body.preco = resultado.preco
    req.body.quantidadeEstoque = resultado.quantidadeEstoque
    req.body.minimoEstoque = resultado.minimoEstoque
    req.body.categoryId = resultado.categoryId    
    
    next()
}

export default validarProduto;