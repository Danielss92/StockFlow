import { useState, useEffect } from "react"
import "./Dashboard.css"

function Dashboard(){

    const[quantidadeProdutos, setQuantidadeProdutos] = useState(0)

   const [produtoEstoqueBaixo, setProdutosEstoqueBaixo] = useState(0)

   const [quantidadeVendas, setQuantidadeVendas] = useState(0)

   

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

          setQuantidadeProdutos(dados.length);

          const produtosBaixos= dados.filter(
            produto => produto.quantidadeEstoque <= produto.minimoEstoque 
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
    },[])
  

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