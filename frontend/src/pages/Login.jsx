import { useState } from "react";
import "./Login.css"
import { useNavigate } from "react-router-dom"

function Login({ setToken }) {
    const [email, setEmail] = useState(""); /*valor atual (email) e função que altera o valor(setEmail) */
    /* setEmail vai fazer o email passar de vazio para o valor preenchido pelo usuario*/
    const [senha, setSenha] = useState("")

    const [mensagem, setMensagem] = useState("")
    const [tipoMensagem, setTipoMensagem] = useState("")
    const navigate = useNavigate()//permitirá mudar de rota pelo código, sem o usuário precisar clicar em um link.

    

    async function fazerLogin(event) { /*função executada quando o usuario enviar o formulario. Async porque dentro dela
        será feita uma requisição http. Event representa o evento que aconteceu no navegador, carregando as informações do evento quando o metodo é executado */
        event.preventDefault()//impede o comportamente padrao do formulario(enviar a página e recarregá-la.)
        /*com preventDefault = faça a requisição sem recarregar a página.*/
      
        

        const resposta = await fetch("http://localhost:3000/login", {
            /*await espera o fetch terminar e receber a respota antes de continuar*/

            method: "POST",
            headers: {
                "Content-Type": "application/json"/*são informações adicionais enviadas junto da requisição: "O conteúdo que estou enviando está no formato JSON." */
            },
            body: JSON.stringify({/*body = corpo da requisição onde ficarão os dados de login*/
                /*JSON.stringfy - converte o objeto JavaScript { email, senha } em uma string no formato JSON antes de enviá-lo na requisição HTTP*/
                /*Protocolo HTTP transfere texto (strings): A função fetch não aceita diretamente um objeto JavaScript puro (como { email: "...", senha: "..." }) no campo body. Ela precisa de uma string de texto. O header tambem definiu que os dados enviados seriam em json*/
                /*No backend, o Express consegue interpretar esse JSON graças ao: app.use(express.json())*/
                email,
                senha
            })



        })

        const dados = await resposta.json() /*resposta.json transforma a resposta vinda do fetch(json)em um objeto javascript*/
        if (!resposta.ok) {
            setMensagem(dados.message || "Email ou senha inválidos")
            {/*dados.message guarde a mensagem que veio do backend, se nao houver uma, a mensagem será "Email ou senha invalidos" */ }
            setTipoMensagem("erro")  /*tipomensagem é usado no return logo abaixo de <h1> login </h1>*/
            return
        }
        localStorage.setItem("token", dados.token);/*salva o token gerado no localStorage do navegador */
        setToken(dados.token)

        setMensagem("Login realizado com sucesso!")
        setTipoMensagem("sucesso")

        setTimeout(()=>{
            navigate("/")/*navega para o dashboard */
        }, 1000) /*mostra a mensagem durante um segundo . Serve apenas para dar tempo de ler a confirmação*/


        console.log("TOKEN: ", dados.token);
        console.log("Mensagem: ", dados.message)

    }

    return (/*O componente Login precisa devolver aquilo que será mostrado na tela. Por isso o return */

        <main>{/*elemento HTML que representa o conteúdo principal da página. */}

            <div className="login-container">

                <h1>Login</h1>

                {mensagem && (
                    <p className={`mensagem-login ${tipoMensagem}`}>
                        {mensagem}
                    </p>
                )}

                <form onSubmit={fazerLogin}>{/*Quando esse formulário for enviado, execute fazerLogin.*/}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}/*Aqui conectamos o <input> ao estado email.*/
                        onChange={(event) => setEmail(event.target.value)} /> {/*onChange acontece quando o valor do campo muda.
                event.target representa o input, que é o elemento que gerou o evento. Value é o texto que está dentro dele. */}


                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)} />

                    <button type="submit">Entrar</button>{/*quem faz o "onSubmit" do form é o botao que possui a propriedade "submit"*/}

                </form>
            </div>

        </main>
    )


}

export default Login