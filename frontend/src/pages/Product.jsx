import { useEffect, useState } from "react"
import "./Product.css"

function Product({setToken}) {

    

    const [produtos, setProdutos] = useState([]);

    //CAMPOS DO FORMULARIO. Estados que armazenam o que o usuario vai digitar no formulario

    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [quantidadeEstoque, setQuantidadeEstoque]= useState("");
    const [minimoEstoque, setMinimoEstoque] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [produtoEditando, setProdutoEditando] = useState(null); // armazena o id do produto que está sendo editado. Começa null pois significa que nenhum produto está sendo editado logo no inicio, somente quando o metodo editarProduto for chamado. Entao o formulario estará no modo de edição e nao de cadastro. 

    const [mensagem, setMensagem] = useState(""); //Mensagem exibida ao usuario caso tente excluir um produto associado a uma venda
    const [tipoMensagem, setTipoMensagem] = useState("");

  async function buscarProdutos() {

            const token = localStorage.getItem("token")/*pega o token salvo durante o login*/

           

            const resposta = await fetch("http://localhost:3000/produtos", {/*fetch é usado para fazer requisições http*/
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`/*o token é enviado ao backend, porque o backend autenticarUsuario pede o token*/
                    /*autenticarUsuario vem do middleware authMiddleware */
                }


            })

           
            const dados = await resposta.json()/*Pega o texto em json e transforma em um objeto/array javascript */

           if(resposta.status=== 401){//se o token nao for valido/tiver sido expirado
            localStorage.removeItem("token");//apaga o valor do token atual armazenado no localStorage
            setToken(null); //manda null para o setToken do privateRoute e redireciona para login
            return
           }

            setProdutos(dados)


        }


    useEffect(() => {

         function listarProdutos(){

             buscarProdutos() //outra solução seria nao ter a função buscarProdutos e, a logica que está nela, ser colocada diretamente no useEffect
        }
        
        listarProdutos()
        
    }, [])

    function editarProduto(produto){
       //permite editar produto ao clicar no botao

       setProdutoEditando(produto.id) //armazena o id do produto que está sendo editado

       setNome(produto.nome);
       setPreco(produto.preco);
       setQuantidadeEstoque(produto.quantidadeEstoque);
       setMinimoEstoque(produto.minimoEstoque);
       setCategoryId(produto.categoryId);

       //permite que as informações do produto selecionado através do botao editar, apareçam no formulario, atualizando os states com as informações do produto selecionado
    }


    //ENVIAR FORMULARIO AO BACKEND
    async function cadastrarProduto(){

        const token = localStorage.getItem("token");

        const resposta = await fetch(`http://localhost:3000/produtos${produtoEditando ? `/${produtoEditando}`: ""}`, {
            /*Essa linha: `http://localhost:3000/produtos${produtoEditando ? `/${produtoEditando}`: ""}`, carrega um template string. Isso porque o formulario pode mudar entre a função de criar o produto e de editar o produto. produtoEditando carrega um id. Então se produtoEditando nao for null, o endereço do localhost será .../produtos/id, se estiver no modo de criação, o localhost será apenas .../produto. Por isso o "" vazio. */
            method: produtoEditando ? "PUT" : "POST" , // operador ternario verifica se produtoEditando é null, ou nao. Se for, a função é de criar produto(POST) se nao é de editar produto(PUT
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                /*JSON.stringify() → transforma o objeto em JSON para poder ser enviado no body do fetch.
                   */

                    nome,
                    preco: Number(preco),
                    quantidadeEstoque: Number(quantidadeEstoque),
                    minimoEstoque: Number(minimoEstoque),
                    categoryId: Number(categoryId)

                    /*  Number() → garante que valores que vieram do <input> como string sejam enviados como número, porque o backend espera esse tipo e o Prisma/banco também trabalha com o tipo definido no schema. Ou seja, Number é o tipo definido no banco de dados para essas propriedades e para o prisma conseguir colocar esses valores no banco de dados precisa passa-los no formato certo.  */

            })
        })

        const dados = await resposta.json();

        buscarProdutos();
        setProdutoEditando(null) //depois de atualizar o produto, setProdutoEditando precisa volta para null para que o "PUT" saia do method do Fetch e troque pelo POST.

        setNome("");//limpa os campos após criar o produto
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



        buscarProdutos() // atualiza a lista de produtos na tela 
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
             {/*Vai mostrar uma mensagem de erro caso o usuario tente deletar um produto que está associado a uma venda. Essa estrutura utilizando &&  é uma forma curta de dizer: Se mensagem tiver algum conteúdo, mostre o <p>. tipoMensagem possui dois valores:erro ou sucesso, entao o elemento poderá assumir duas classes dependendo da mensagem*/}


        <div className="lista-produtos">
            {produtos.map((produto) => (
                <p key={produto.id}> {/*key é uma propriedade do react que serve como identificador unico para cada elemento retornado */}
                    <span>{produto.nome}</span>


                    <button type="button" className="botao-editar" onClick={()=> editarProduto(produto)}>Editar</button> {/*editar cada um dos produtos */}
                    {/*Executa o metodo editarProduto. Quando clicar neste botão, execute editarProduto usando este produto específico */}

                    <button type="button" className="botao-deletar" onClick={()=> excluirProduto(produto.id)}>Deletar</button>
                </p>

            ))}
            </div>
        </div>
    )

}

export default Product