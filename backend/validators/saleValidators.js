
function validarItensVenda(itens){

    if(!Array.isArray(itens) || itens.length === 0){

        return {
            valido: false,
            message: "A venda deve possuir pelo menos um item"
        }
    }

    const produtos = new Set()// armazena valores sem repetição


    for(const item of itens){
        if(!Number.isInteger(item.produtoId)|| item.produtoId < 1){
              
            return {
                valido: false,
                mensagem: "O produto informado é inválido"
            }
        }

        if(produtos.has(item.produtoId)){// verifica se esse produto ja foi registrado na mesma venda(verifica isso atraves dos valores armazenados no SET)
            return{
                valido:false,
                mensagem : "O mesmo produto nao pode aparecer mais de uma vez na venda"
            }
        }
        

         if (!Number.isInteger(item.quantidade) || item.quantidade < 1) {
            return {
                valido: false,
                mensagem: "A quantidade deve ser um número inteiro maior que 0"
            }
        }

        produtos.add(item.produtoId)
    }


    return {
        valido: true
    }









    }

    export default validarItensVenda;
   

