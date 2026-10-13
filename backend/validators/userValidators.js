

function validarUsuario(nome, email, senha){

    if(typeof nome !== "string"){
        return {
            valido : false, 
            mensagem: "O nome deve ser um texto"
        }
    }

    if(nome.trim()===""){
        return {
            valido: false,
            mensagem: "O nome é obrigatório"
        }
    }

    const nomeFormatado = nome.trim()

    if(nomeFormatado.length > 100){

        return{
            valido : false,
            mensagem: "O nome deve conter no máximo 100 caracteres"
        }
    }

    if(typeof email !== "string"){

        return {
            valido : false,
            mensagem: "O email deve ser um texto"
        }
    }

    const emailFormatado = email.trim();

    if(emailFormatado === ""){

        return{
            valido: false,
            mensagem: "O email é obrigatório"
        }
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!formatoEmail.test(emailFormatado)){

        return{
            valido: false, 
            mensagem: "O email informado é inválido"
        }
    }

    if(typeof senha !== "string"){
        return{
            valido: false, 
            mensagem: "A senha deve ser um texto"
        }
    }

    if(senha.length < 6){
        return{
            valido: false,
            mensagem: "A senha deve ter no mínimo 6 caracteres"
        }
    }

    return {
        valido: true,
        nome: nomeFormatado,
        email: emailFormatado,
        senha : senha
    }








}

export default validarUsuario;