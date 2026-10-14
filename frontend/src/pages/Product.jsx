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


    useEffect(() => {

         function listarProdutos(){

             buscarProdutos() 
        }
        
        listarProdutos()
        
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

        <div className="produto-formulario">

            {/*FORMULARIO */}
            <h2>{produtoEditando ? "Editar Produto" : "Novo Produto"}</h2>

            <input type="text" placeholder="Nome" value={nome} onChange={(event) => setNome(event.target.value)}/>

            <input type="number" placeholder="Preço" value={preco} onChange={(event)=> setPreco(event.target.value)}></input>

            <input type="number" placeholder="Quantidade em estoque" value={quantidadeEstoque} onChange={(event)=> setQuantidadeEstoque(event.target.value)}></input>

            <input type="number" placeholder="Estoque minimo" value={minimoEstoque} onChange={(event)=> setMinimoEstoque(event.target.value)}></input>

            <input type="number" placeholder="ID da categoria" value={categoryId} onChange={(event)=> setCategoryId(event.target.value)}></input>

            <button type="button" onClick={cadastrarProduto}>{produtoEditando ? "Salvar alterações": "Cadastrar produto"}</button>

            {/*FIM FORMULARIO */}

            <h1>Produtos</h1>   

            {mensagem && (<p className={`mensagem-produto ${tipoMensagem}`}>{mensagem}</p>  )}
            


        <div className="lista-produtos">
            {produtos.map((produto) => (
                <p key={produto.id}> 
                    <span>{produto.nome}</span>


                    <button type="button" className="botao-editar" onClick={()=> editarProduto(produto)}>Editar</button> 

                    <button type="button" className="botao-deletar" onClick={()=> excluirProduto(produto.id)}>Deletar</button>
                </p>

            ))}
            </div>
        </div>
    )

}

export default Product