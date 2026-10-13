
//função que recebe o nome e retorna o resultado da validação

function validarNomeCategoria(nome){

    if(typeof nome !=="string"){

        return{
              valido: false,
                mensagem : "O nome da categoria deve ser texto"

        }
      
    }


    if (nome.trim() === "") {
        return {
            valido: false,
            mensagem: "O nome da categoria é obrigatório"
        }
    }

    const nomeFormatado = nome.trim()

    if (nomeFormatado.length > 100) {
        return {
            valido: false,
            mensagem: "O nome da categoria deve ter no máximo 100 caracteres"
        }
    }

    return {
        valido: true,
        nome: nomeFormatado
    }
}

export default validarNomeCategoria;