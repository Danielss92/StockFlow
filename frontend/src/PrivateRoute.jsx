
//Verifica a autenticação no frontEnd. Verifica se possui token

import {Navigate} from "react-router-dom"



function PrivateRoute({children, token}){



    
    if(!token){
        return <Navigate to = "/login" />  
    }

return children 
} 
    
export default PrivateRoute






