import { useState } from "react";
import "./Login.css"
import { useNavigate, Link } from "react-router-dom"


function Login({ setToken }) {
    const [email, setEmail] = useState(""); 
    const [senha, setSenha] = useState("")

    const [mensagem, setMensagem] = useState("")
    const [tipoMensagem, setTipoMensagem] = useState("")
    const navigate = useNavigate()

    

    async function fazerLogin(event) { 
        event.preventDefault()
      
        

        const resposta = await fetch("http://localhost:3000/login", {
          
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                senha
            })



        })

        const dados = await resposta.json() 
        if (!resposta.ok) {
            setMensagem(dados.message || "Email ou senha inválidos")
            
            setTipoMensagem("erro")  
            return
        }
        localStorage.setItem("token", dados.token);
        setToken(dados.token)

        setMensagem("Login realizado com sucesso!")
        setTipoMensagem("sucesso")

        setTimeout(()=>{
            navigate("/")
        }, 1000) 


        console.log("TOKEN: ", dados.token);
        console.log("Mensagem: ", dados.message)

    }

  
return (
    <main>
        <div className="login-container">

            <h1>Login</h1>

            {mensagem && (
                <p className={`mensagem-login ${tipoMensagem}`}>
                    {mensagem}
                </p>
            )}

            <form onSubmit={fazerLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                />

                <button type="submit">Entrar</button>

            </form>

            <p className="login-cadastro">
                Não tem uma conta? <Link to="/register">Criar conta</Link>
            </p>

        </div>
    </main>
);



}

export default Login