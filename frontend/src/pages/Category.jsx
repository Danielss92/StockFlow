
import { useEffect, useState } from "react"
import "./Category.css"

function Category() {

    const [categorias, setCategorias] = useState([])

    const [nome, setNome] = useState("");
    const [mensagem, setMensagem] = useState("");

    const [categoriaEditando, setCategoriaEditando] = useState(null)

    const [tipoMensagem, setTipoMensagem] = useState("")

    async function buscarCategorias() {

        const token = localStorage.getItem("token")

        const resposta = await fetch("http://localhost:3000/categories", {

            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const dados = await resposta.json()

        setCategorias(dados)

    }

    async function editarCategoria(categoria) {

        setCategoriaEditando(categoria.id)
        setNome(categoria.nome)



    }

    useEffect(() => {

        function carregarCategorias() {

            buscarCategorias()
        }

        carregarCategorias()
    }, [])

    //#region CADASTRAR CATEGORIA

    async function cadastrarCategoria() {

        const token = localStorage.getItem("token");

        const resposta = await fetch(`http://localhost:3000/categories${categoriaEditando ? `/${categoriaEditando}` : ""}`, {

            method: categoriaEditando ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                nome
            })
        })

        const dados = await resposta.json();

        console.log("Cetegoria: ", dados);

        buscarCategorias()


        setNome("");
        setCategoriaEditando(null)



    }
    //#endregion


    async function excluirCategoria(id) {
        const token = localStorage.getItem("token");


        const resposta = await fetch(`http://localhost:3000/categories/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const dados = await resposta.json();

        if (!resposta.ok) {

            setMensagem(dados.message);
            setTipoMensagem("erro")
            return
        }
        console.log("Categoria excluída:", dados);

        setMensagem("Categoria excluída com sucesso", dados)

        setTipoMensagem("sucesso")

        buscarCategorias()
    }
    return (
        <main className="categorias-page">

            <header className="categorias-header">
                <h1>Categorias</h1>
                <p>Organize os produtos do seu estoque por categoria.</p>
            </header>

            {mensagem && <p className={`mensagem-categoria ${tipoMensagem}`}>{mensagem}</p>}

            <section className="categoria-secao">

                <h2>
                    {categoriaEditando ? "Editar categoria" : "Nova categoria"}
                </h2>

                <form onSubmit={(event) => { event.preventDefault(); cadastrarCategoria() }}>


                    <div className="categoria-formulario">
                        <input type="text" placeholder="Nome da categoria" value={nome} onChange={(event) => setNome(event.target.value)}></input>

                        <button type="submit"> {categoriaEditando ? "Salvar alterações" : "Cadastrar categoria"}</button>
                    </div>
                </form>
            </section>

            <section className="lista-categorias">
                <h2>Categorias cadastradas</h2>


                {categorias.length === 0 ? (
                    <p>Nenhuma categoria cadastrada.</p>
                ) : (
                    categorias.map((categoria) => (
                        <div className="categoria-item" key={categoria.id}>
                            <span className="categoria-nome">
                                {categoria.nome}
                            </span>

                            <button
                                type="button"
                                className="botao-editar"
                                onClick={() => editarCategoria(categoria)}
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                className="botao-deletar"
                                onClick={() => excluirCategoria(categoria.id)}
                            >
                                Excluir
                            </button>
                        </div>
                    ))
                )}
            </section>
        </main>

    )
}

export default Category