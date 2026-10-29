

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState("");

    const navigate = useNavigate();

    async function cadastrarUsuario(event) {
        event.preventDefault();

        try {
            const resposta = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setMensagem(dados.message || "Não foi possível realizar o cadastro.");
                setTipoMensagem("erro");
                return;
            }

            navigate("/login");
        } catch {
            setMensagem("Não foi possível conectar ao servidor.");
            setTipoMensagem("erro");
        }
    }

    return (
        <main className="cadastro-page">
            <section className="cadastro-card">
                <h1>Criar conta</h1>
                <p>Cadastre-se para acessar o StockFlow.</p>

                {mensagem && (
                    <p className={`mensagem-cadastro ${tipoMensagem}`}>
                        {mensagem}
                    </p>
                )}

                <form onSubmit={cadastrarUsuario}>
                    <label htmlFor="nome">Nome</label>
                    <input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                        placeholder="Seu nome"
                        required
                    />

                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="seu@email.com"
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                        placeholder="Crie uma senha"
                        required
                    />

                    <button type="submit">Criar conta</button>
                </form>

                <p className="cadastro-login">
                    Já tem uma conta? <Link to="/login">Entrar</Link>
                </p>
            </section>
        </main>
    );
}

export default Register;
