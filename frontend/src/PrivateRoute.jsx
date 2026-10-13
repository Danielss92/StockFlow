
//Verifica a autenticação no frontEnd. Verifica se possui token

import {Navigate} from "react-router-dom"// importa o navigate que permite ao react trocar de rota



function PrivateRoute({children, token}){// children irá representar o conteudo dentro do privateRoute, no caso o componente de rota que será passando quando o metodo for chamado no app.jsx



    
    if(!token){//vai simplesmente verificar se o token que veio de app.jsx existe ou nao
        return <Navigate to = "/login" />  //se o token nao existe, retorna para a pagina de login
    }

return children // mostra o componente que está dentro do PrivateRoute. O conteudo está nos Private Routes passados no app.jsx
} 
    
export default PrivateRoute






