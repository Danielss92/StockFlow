import jwt from "jsonwebtoken";


function autenticarUsuario(req, res, next){

    try{
    
        console.log("HEADERS RECEBIDOS:",req.headers)
    const authHeader = req.headers.authorization
   

    if(!authHeader){
        return res.status(401).json({
            message: "Token não informado"
        })
    }

    const token = authHeader.split(" ")[1]

 

    const dadosToken = jwt.verify(token, process.env.JWT_SECRET)

    req.usuarioId = dadosToken.id;

    next()
}
catch( error){
    console.error("ERRO JWT: ", error)
     res.status(401).json({
        message: "Token inválido ou expirado"
    })
}

}

export default autenticarUsuario;