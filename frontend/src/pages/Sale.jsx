
import { useState, useEffect } from "react"
import "./Sale.css"



function Sale() {

    const [vendas, setVendas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(""); // vai guardar o id do produto escolhido
    const [quantidade, setQuantidade] = useState(1) //uma nova venda começa com pelo menos uma unidade. 
    const [itensVenda, setItensVenda] = useState([]) // itens da nova venda, armazena os produtos que o usuario adicionou à venda
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

            /*A função aqui nao precisa obrigatoriamente ser assincrona. A intenção foi fazer buscarVendas esperar primeiro o buscarProdutos terminar de carregar(através do await) para executar. Porém as duas buscas sao independetes, entao poderia ser feito sem o async*/


            await buscarProdutos();
            await buscarVendas();




        }


        carregarDados();
    }, []) //sem os colchetes ele executa após toda a renderização. Com colchetes  ele executa somente após a primeira. Se houvesse um valor dentro dos colchetes(produtoId por exemplo), entao ele seria executado na primeira renderização e quando o produtoId mudasse, ou seja, o efeito estaria dependente de uma variavel.

    function adicionarItem() {//função que vai ser ativada após clique de um botao. Nao pode ser colocada no useEffect pois nao será executada assim que a pagina carregar

        const novoItem = {
            produtoId: Number(produtoSelecionado), //o <select> também fornece seu value como string
            quantidade: Number(quantidade)
        }

        setItensVenda([...itensVenda, novoItem])//Pegue os itens que já estavam na lista e coloque o novo item no final. Sem os 3 pontos, ele criaria um array como um outro elemento separado dentro do array existente e novoItem seria um segundo elemento. Sem 3 pontos ele nao colocaria o novoItem dentro de itensVenda e sim criaria o elemento itensVenda e novoItem.

        console.log("Itens da venda: ", [...itensVenda, novoItem])

    }

    async function finalizarVenda() {
        // manda itensVenda ao backend/servidor
        const token = localStorage.getItem("token");

        const resposta = await fetch("http://localhost:3000/sales", {
            method: "POST", // se nao especificar o METHOD o navegador entende por padrao que é GET
            headers: {
                "Content-Type": "application/json", //é uma etiqueta de identificação do formato dos dados enviados no body. Avisa ao servidor backend: O texto que estou te enviando no body está formatado no padrão JSON. Por favor, interprete-o como um JSON.
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({// pega o objeto/array javascript e o transforma em uma string em formato Json. A função fetch nao consegue enviar um objeto nativo javascript, somente texto e a comunicação HTTP envia sequencia de caracteres/strings
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

        setItensVenda([]) // limpa a ultima lista  de produtos e quantidades de vendas adicionadas que aparecem na tela ao clicar no botao finalizar venda. 
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



                <select value={produtoSelecionado} onChange={(event) => setProdutoSelecionado(event.target.value)}> {/*Exiba visualmente como selecionada a opção cujo valor seja igual ao contido na variável produtoSelecionado */}
                    {/*onChange é um escutador de evento. Quando um item dentro de select muda, onChange dispara e o event carrega todas as informações do elemento que foi alterado dentro do select. event.target.value carrega o valor desse elemento, que nesse caso é um id de produto, que será passado para o metodo setProdutoSelecionado */}



                    <option value="">Selecione um produto</option>

                    {produtos.map((produto) => (
                        <option key={produto.id} value={produto.id}>
                            {produto.nome}
                        </option>
                    ))}



                </select>


                <input type="number" min={1} value={quantidade} onChange={(event) => setQuantidade(event.target.value)}>
                </input>

                <button type="button" onClick={adicionarItem}> {/* vai adicionar novo objeto ao itensVenda*/}

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
                {itensVenda.map((item) => { // exibe o produto e a quantidade selecionada


                    const produto = produtos.find(
                        (produto) => produto.id === item.produtoId //Dentro de produtos, encontre o produto cujo id seja igual ao produtoId deste item.
                    )

                    return (
                        <div className="item-venda" key={item.produtoId}>
                            <p key={item.produtoId}>
                                Produto: {produto.nome} | Quantidade: {item.quantidade} {/*pega o nome do produto que está dentro de produtos. Vai exibir nome e quantidade ao clicar em adicionar Produto*/}
                            </p> </div>
                    )

                })}

            </div>

            <h1>Vendas</h1>

            <div className="lista-vendas">

            {vendas.map((venda) => (


                <div className="item-venda-realizada" key={venda.id}>    {/*Cada .map() que gera uma lista de elementos precisa que o React consiga identificar os elementos daquela lista. Nao é necessario colocar key em todo elemento HTML. Foi colocado aqui pois o map está criando esses elementos */}

                    <h2>Venda #{venda.id}</h2>
                    <p>Data: {new Date(venda.criadoEm).toLocaleString("pt-BR")}</p>

                    <button type="button" onClick={() => excluirVenda(venda.id)}>Excluir</button>

                    <h3>Itens:</h3>

                    {venda.itens.map((item) => (/*Uma venda pode ter varios itens*/
                        <p key={item.id}> {/*utiliza-se key novamente porque é um outro map diferente. O anterior que está na div, nao identifica os p internos dos itens */}
                            Produto: {item.produto.nome} | Quantidade: {item.quantidade}  {/*pegue o produto que está dentro do item e, dentro dele, pegue o nome. */}
                            {/*o simbolo | é apenas um caractere visual para separar os itens visualmente. Não tem função no jsx */}
                        </p>
                    ))}

                </div>
            ))}
            </div>










        </main>
    )

}

export default Sale