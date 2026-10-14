
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
        } )
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
        <main>
            <h1>Categorias</h1>

            {mensagem && <p className={`mensagem-categoria ${tipoMensagem}`}>{mensagem}</p>}

            <h2>Nova categoria</h2>

            <form onSubmit={(event) => { event.preventDefault(); cadastrarCategoria() }}>

                
                <div className="categoria-formulario">
                <input type="text" placeholder="Nome da categoria" value={nome} onChange={(event) => setNome(event.target.value)}></input> 

                <button type="submit"> Cadastrar categoria</button> 
                </div>
            </form>

            {categorias.map((categoria) => ( 

                <p key={categoria.id}> 

                    {categoria.nome}

                    <button type="button" className="botao-editar" onClick={() => editarCategoria(categoria)}>Editar</button>
                   

                    <button type="button" className="botao-deletar
                    " onClick={() => excluirCategoria(categoria.id)}>Excluir</button>

                </p>
            ))}
        </main>

    )
}

export default Category