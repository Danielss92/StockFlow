import { useState, useEffect } from "react"
import "./Dashboard.css"

function Dashboard(){

    const[quantidadeProdutos, setQuantidadeProdutos] = useState(0)

   const [produtoEstoqueBaixo, setProdutosEstoqueBaixo] = useState(0)

   const [quantidadeVendas, setQuantidadeVendas] = useState(0)

   //#region BuscarProdutos

   //#region BuscarVendas
   async function buscarVendas(){
    const token = localStorage.getItem("token");

    const resposta = await fetch("http://localhost:3000/sales",{

        headers:
        {
            Authorization: `Bearer ${token}`
        }
    })

    const dados = await resposta.json();

    setQuantidadeVendas(dados.length);




   }
   
   //#endregion

    async function buscarProdutos() {

        const token = localStorage.getItem("token");

        const resposta = await fetch("http://localhost:3000/produtos",{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })


          const dados = await resposta.json();

          setQuantidadeProdutos(dados.length);//passe a quantidade de produtos para o quantidadeProdutos através do setQuantidadeProdutos

          const produtosBaixos= dados.filter(//percorre todos os produtos e mantem somente aqueles que satisfazem
            produto => produto.quantidadeEstoque <= produto.minimoEstoque //dados é uma lista com resultados da resposta do fetch. Produto contem um item individual que está dentro da lista de dados. Poderia ser feito com outro nome, por exemplo: item => item.quantidadeEstoque <= item.minimoEstoque
          )

          setProdutosEstoqueBaixo(produtosBaixos.length)


        
    }

    
     useEffect(() => {
      async function carregarProdutos() {
        await buscarProdutos()
    }
        async function carregarVendas(){
            await buscarVendas()
        }
        carregarProdutos()
        carregarVendas()
    },[])//O [] significa que o efeito será executado quando o componente for carregado.

  

    return(
        <main>
            <h1>Dashboard</h1>
            <p>Bem vindo ao StockFlow!  Acompanhe seus produtos, estoque e vendas.</p>

            <div className="dashboard-cards">
                
                <div className="card">
                    <h2>Produtos</h2>
                    <p>{quantidadeProdutos}</p>
                </div>

                <div className="card">
                    <h2>Estoque baixo</h2>
                    <p>{produtoEstoqueBaixo}</p>
                </div>

                <div className="card">
                    <h2>Vendas</h2>
                    <p>{quantidadeVendas}</p>
                </div>



            </div>
         


        </main>
    )
}

export default Dashboard