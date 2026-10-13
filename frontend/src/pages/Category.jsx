
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

        setCategoriaEditando(categoria.id)//objeto categoria é recebido ao clicar no botao editar
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

        buscarCategorias() //lista novamente as categorias
    }
    return (
        <main>
            <h1>Categorias</h1>

            {mensagem && <p className={`mensagem-categoria ${tipoMensagem}`}>{mensagem}</p>}

            <h2>Nova categoria</h2>

            <form onSubmit={(event) => { event.preventDefault(); cadastrarCategoria() }}>

                {/*preventDefault impede que a pagina seja recarregada quando o formulario for enviado */}
                <div className="categoria-formulario">
                <input type="text" placeholder="Nome da categoria" value={nome} onChange={(event) => setNome(event.target.value)}></input> {/*Cada vez que houver mudança  no campo do input setNome receberá esse valor. O valor do input vem da propriedade nome, que é atribuida atraves de setNome */}

                <button type="submit"> Cadastrar categoria</button>  {/*com "submit" o navegador entende que esse botao é para enviar o formulario */}
                </div>
            </form>

            {categorias.map((categoria) => ( //esta sendo usado chaves aqui pois é a execução de um codigo puramente javascript em um jsx. As chaves dizem basicamente A partir daqui, quero executar uma expressão JavaScript.

                <p key={categoria.id}> {/*O valor dessa propriedade será uma expressão javascript */}

                    {categoria.nome}

                    <button type="button" className="botao-editar" onClick={() => editarCategoria(categoria)}>Editar</button>
                    {/*Vai passar o objeto categoria para o metodo editarCategoria */}

                    <button type="button" className="botao-deletar
                    " onClick={() => excluirCategoria(categoria.id)}>Excluir</button>

                </p>
            ))}
        </main>

    )
}

export default Category