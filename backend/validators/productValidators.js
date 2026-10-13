

function validarNomeProduto(nome, preco, quantidadeEstoque, minimoEstoque, categoryId){
  

    if (typeof nome !== "string") {
        return {
            valido: false,
            mensagem: "O nome do produto deve ser um texto"
        }
    }

    if (nome.trim() === "") {
        return {
            valido: false,
            mensagem: "O nome do produto é obrigatório"
        }
    }

    const nomeFormatado = nome.trim()

    if (nomeFormatado.length > 100) {
        return {
            valido: false,
            mensagem: "O nome do produto deve ter no máximo 100 caracteres"
        }
    }
 if (typeof preco !== "number" || preco < 0) {
      return {
        valido: false,
        mensagem: "O preco do produto deve ser um valor maior ou igual a 0",
      };
    }

     if(!Number.isInteger(quantidadeEstoque) || quantidadeEstoque<0){

      return {
        valido: false,
        mensagem: "O valor da quantidade de estoque deve ser um numero inteiro e maior ou igual a 0"
      }
    }

     if (!Number.isInteger(minimoEstoque) || minimoEstoque < 0) {
      return{
        valido: false,
        mensagem:
          "A quantidade minima do estoque deve ser um valor inteiro, maior ou igual a 0",
      }
    }

      if(!Number.isInteger(categoryId) || categoryId <1){
      return{
        valido: false,
        mensagem: "o valor da categoria deve ser um numero inteiro e maior que 0"
      }
    }

    return {
        valido: true,
        nome: nomeFormatado,
        preco: preco,
        quantidadeEstoque : quantidadeEstoque,
        minimoEstoque: minimoEstoque,
        categoryId: categoryId
    }
}



export default validarNomeProduto;