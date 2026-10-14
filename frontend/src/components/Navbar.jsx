import {Link} from "react-router-dom"
import "./Navbar.css"

function Navbar({token, setToken}){
    function sair(){
        localStorage.removeItem("token");
        setToken(null)
    }


    return(
        <nav>
            <h2>StockFlow</h2>

            <Link to =  "/">Dashboard</Link>
            <Link to = "/produtos">Produtos</Link>
            <Link to = "/categories">Categorias</Link>
            <Link to = "/sales">Vendas</Link>

            {token ?(
                    <button type="button" onClick={sair}>Sair</button>
                ) : (
                         <Link to="/login">Entrar</Link>

                )}
            
        </nav>
    )
}

export default Navbar // 