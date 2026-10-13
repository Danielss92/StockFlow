import {Link} from "react-router-dom"
import "./Navbar.css"

function Navbar({token, setToken}){//propriedade setToken

    function sair(){
        localStorage.removeItem("token");//função remover token ao fazer logout
        setToken(null)
    }


    return(
        <nav>
            <h2>StockFlow</h2>

            <Link to =  "/">Dashboard</Link>
            <Link to = "/produtos">Produtos</Link>
            <Link to = "/categories">Categorias</Link>
            <Link to = "/sales">Vendas</Link>

            {token ?( /*se o usuario estiver autenticado*/
                    <button type="button" onClick={sair}>Sair</button>
                ) : (
                         <Link to="/login">Entrar</Link>

                )}
            
        </nav>
    )
}

export default Navbar // é importado no app.jsx