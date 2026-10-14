
import { useState, useEffect } from "react"
import "./Sale.css"



function Sale() {

    const [vendas, setVendas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(""); 
    const [quantidade, setQuantidade] = useState(1) 
    const [itensVenda, setItensVenda] = useState([]) 
    const [mensagem, setMensagem] = useState("")
    const [tipoMensagem, setTipoMensagem] = useState("")

    async function buscarVendas() {

        const token = localStorage.getItem("token");

        const resposta = await fetch("http://localhost:3000/sales", {

            headers: {
                Authorization: `Bearer ${token}`
            }

        })

        const dados = await resposta.json();

        console.log("Vendas recebidas: ", dados);

        setVendas(dados);




    }

    async function buscarProdutos() {

        const token = localStorage.getItem("token");

        const resposta = await fetch("http://localhost:3000/produtos", {

            headers: {
                Authorization: `Bearer ${token}`
            }

        })

        const dados = await resposta.json();

        console.log("Produtos: ", dados)

        setProdutos(dados);



    }

    useEffect(() => {


        async function carregarDados() {

          


            await buscarProdutos();
            await buscarVendas();




        }


        carregarDados();
    }, []) 

    function adicionarItem() {

        const novoItem = {
            produtoId: Number(produtoSelecionado), 
            quantidade: Number(quantidade)
        }

        setItensVenda([...itensVenda, novoItem])
        console.log("Itens da venda: ", [...itensVenda, novoItem])

    }

    async function finalizarVenda() {
        
        const token = localStorage.getItem("token");

        const resposta = await fetch("http://localhost:3000/sales", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                itens: itensVenda
            })
        })

        const dados = await resposta.json()
        if (!resposta.ok) {
            setMensagem(dados.message)
            setTipoMensagem("erro")
            return
        }


        console.log("Resposta da venda: ", dados)

        buscarVendas()

        setItensVenda([]) 
        setMensagem("Venda realizada com sucesso")
        setTipoMensagem("sucesso")

    }

    async function excluirVenda(id) {


        const token = localStorage.getItem("token");

        const resposta = await fetch(`http://localhost:3000/sales/${id}`, {
            method: "DELETE",
            headers: {

                Authorization: `Bearer ${token}`
            }

        })

        const dados = await resposta.json();

        console.log("Venda excluída com sucesso", dados);

        buscarVendas()
    }




    return (
        <main>

            <h2>Nova Venda</h2>

            <div className="venda-formulario">



                <select value={produtoSelecionado} onChange={(event) => setProdutoSelecionado(event.target.value)}> 



                    <option value="">Selecione um produto</option>

                    {produtos.map((produto) => (
                        <option key={produto.id} value={produto.id}>
                            {produto.nome}
                        </option>
                    ))}



                </select>


                <input type="number" min={1} value={quantidade} onChange={(event) => setQuantidade(event.target.value)}>
                </input>

                <button type="button" onClick={adicionarItem}> 

                    Adicionar item

                </button>

            </div>

            <button type="button" className="botao-finalizar" onClick={finalizarVenda}>

                Finalizar Venda

            </button>

            {mensagem && (
                <p className={`mensagem-venda ${tipoMensagem}`}>
                    {mensagem}
                </p>
            )}

            <div className="lista-itens-venda">
                {itensVenda.map((item) => { 


                    const produto = produtos.find(
                        (produto) => produto.id === item.produtoId 
                    )

                    return (
                        <div className="item-venda" key={item.produtoId}>
                            <p key={item.produtoId}>
                                Produto: {produto.nome} | Quantidade: {item.quantidade} 
                            </p> </div>
                    )

                })}

            </div>

            <h1>Vendas</h1>

            <div className="lista-vendas">

            {vendas.map((venda) => (


                <div className="item-venda-realizada" key={venda.id}>    

                    <h2>Venda #{venda.id}</h2>
                    <p>Data: {new Date(venda.criadoEm).toLocaleString("pt-BR")}</p>

                    <button type="button" onClick={() => excluirVenda(venda.id)}>Excluir</button>

                    <h3>Itens:</h3>

                    {venda.itens.map((item) => (
                        <p key={item.id}> 
                            Produto: {item.produto.nome} | Quantidade: {item.quantidade}  
                        </p>
                    ))}

                </div>
            ))}
            </div>










        </main>
    )

}

export default Sale