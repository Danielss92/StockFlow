import { useEffect, useState } from "react"
import "./Product.css"

function Product({setToken}) {

    

    const [produtos, setProdutos] = useState([]);

  

    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [quantidadeEstoque, setQuantidadeEstoque]= useState("");
    const [minimoEstoque, setMinimoEstoque] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [produtoEditando, setProdutoEditando] = useState(null); 
    const [categorias, setCategorias] = useState([]);

    const [mensagem, setMensagem] = useState(""); 
    const [tipoMensagem, setTipoMensagem] = useState("");

  async function buscarProdutos() {

            const token = localStorage.getItem("token")

           

            const resposta = await fetch("http://localhost:3000/produtos", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }


            })

           
            const dados = await resposta.json()

           if(resposta.status=== 401){
            localStorage.removeItem("token");
            setToken(null); 
            return
           }

            setProdutos(dados)


        }
           async function buscarCategorias() {
    const token = localStorage.getItem("token");

    const resposta = await fetch("http://localhost:3000/categories", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!resposta.ok) {
        return;
    }

    const dados = await resposta.json();
    setCategorias(dados);
}


    useEffect(() => {

         function listarProdutos(){

             buscarProdutos() 
        }
        function listarCategoria(){
            buscarCategorias()
        }
        
        listarProdutos()
        listarCategoria();
        
        
    }, [])

    function editarProduto(produto){
       

       setProdutoEditando(produto.id) 

       setNome(produto.nome);
       setPreco(produto.preco);
       setQuantidadeEstoque(produto.quantidadeEstoque);
       setMinimoEstoque(produto.minimoEstoque);
       setCategoryId(produto.categoryId);

      
    }


    //ENVIAR FORMULARIO AO BACKEND
    async function cadastrarProduto(){

        const token = localStorage.getItem("token");

        const resposta = await fetch(`http://localhost:3000/produtos${produtoEditando ? `/${produtoEditando}`: ""}`, {
           
            method: produtoEditando ? "PUT" : "POST" , 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                

                    nome,
                    preco: Number(preco),
                    quantidadeEstoque: Number(quantidadeEstoque),
                    minimoEstoque: Number(minimoEstoque),
                    categoryId: Number(categoryId)

                 

            })
        })

        const dados = await resposta.json();

        buscarProdutos();
        setProdutoEditando(null) 

        setNome("");
        setPreco("");
        setQuantidadeEstoque("");
        setMinimoEstoque("");
        setCategoryId("");

        console.log("Produto criado: ", dados)




    }

    async function excluirProduto(id) {
        
        const token = localStorage.getItem("token");

        const resposta = await fetch(`http://localhost:3000/produtos/${id}`, {

            method : "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }
            
        } )

        const dados = await resposta.json();

        if(!resposta.ok){
            setMensagem(dados.message)
            setTipoMensagem("erro");
            return
        }

      
        console.log("Produto excluído: ",dados);

        setMensagem("Produto excluído com sucesso")
        setTipoMensagem("sucesso")



        buscarProdutos() 
    }
 

  return (
    <main className="produtos-page">
        <header className="produtos-header">
            <h1>Produtos</h1>
            <p>Gerencie seus produtos, preços e níveis de estoque.</p>
        </header>

        {mensagem && (
            <p className={`mensagem-produto ${tipoMensagem}`}>
                {mensagem}
            </p>
        )}

        <section className="produto-secao">
            <h2>
                {produtoEditando ? "Editar produto" : "Novo produto"}
            </h2>

            <div className="produto-formulario">
                <input
                    type="text"
                    placeholder="Nome do produto"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                />

                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Preço"
                    value={preco}
                    onChange={(event) => setPreco(event.target.value)}
                />

                <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Quantidade em estoque"
                    value={quantidadeEstoque}
                    onChange={(event) =>
                        setQuantidadeEstoque(event.target.value)
                    }
                />

                <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Estoque mínimo"
                    value={minimoEstoque}
                    onChange={(event) =>
                        setMinimoEstoque(event.target.value)
                    }
                />

                <select
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                >
                    <option value="">Selecione uma categoria</option>

                    {categorias.map((categoria) => (
                        <option key={categoria.id} value={categoria.id}>
                            {categoria.nome}
                        </option>
                    ))}
                </select>

                <button type="button" onClick={cadastrarProduto}>
                    {produtoEditando
                        ? "Salvar alterações"
                        : "Cadastrar produto"}
                </button>
            </div>
        </section>

        <section className="lista-produtos">
            <h2>Produtos cadastrados</h2>

            {produtos.length === 0 ? (
                <p>Nenhum produto cadastrado.</p>
            ) : (
                <div className="lista-produtos-grid">
                    {produtos.map((produto) => (
                        <div className="produto-item" key={produto.id}>
                            <span className="produto-nome">
                                {produto.nome}
                            </span>

                            <button
                                type="button"
                                className="botao-editar"
                                onClick={() => editarProduto(produto)}
                            >
                                Editar
                            </button>

                            <button
                                type="button"
                                className="botao-deletar"
                                onClick={() => excluirProduto(produto.id)}
                            >
                                Excluir
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    </main>
);
}

export default Product;

