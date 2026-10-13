import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import Sale from "./pages/Sale"
import Product from "./pages/Product";
import Category from "./pages/Category";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
{/*BrowserRouter = dá ao react capacidade de controlar as rotas
Routes = conjunto de rotas */}


function App() {
  const [token, setToken]= useState(
    localStorage.getItem("token") 
  )


  return (
    <>
      <BrowserRouter>

        <Navbar token={token} setToken={setToken}/> {/*o Navbar.jsx vai receber a função que altera o estado do token  do app.jsx */}
        {/* passando o token para o navbar, ele poderá controlar a exibição do botao de "Sair" ou link "Entrar" e etc */}
        <Routes>
          <Route path="/" element={<Dashboard />} />{/* Quando a URL for /, mostre o componente Dashboard.*/}
          <Route path="/categories" element={
            
            <PrivateRoute token={token}>
              
              <Category />

            </PrivateRoute>
            
            } />
          <Route path="/produtos" element={

            <PrivateRoute token={token}>

              <Product /> {/*componente Product é "children" de PrivateRoute */}

            </PrivateRoute>

          } />

          <Route path="/sales" element={
            
            <PrivateRoute token={token}>

                <Sale />
            </PrivateRoute> } />

          <Route path="/login" element={<Login setToken={setToken}/>} /> {/*envia a FUNÇÃO setToken para o login, para que ele possa alterar o estado do token*/}

        </Routes>


      </BrowserRouter>






    </>

  )
}

export default App
