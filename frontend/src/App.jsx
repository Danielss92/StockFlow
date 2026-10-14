import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import Sale from "./pages/Sale"
import Product from "./pages/Product";
import Category from "./pages/Category";
import Login from "./pages/Login";
import PrivateRoute from "./PrivateRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";



function App() {
  const [token, setToken]= useState(
    localStorage.getItem("token") 
  )


  return (
    <>
      <BrowserRouter>

        <Navbar token={token} setToken={setToken}/> 
        <Routes>
          <Route path="/" element={<Dashboard />} />
            
            <PrivateRoute token={token}>
              
              <Category />

            </PrivateRoute>
            
             
          <Route path="/produtos" element={

            <PrivateRoute token={token}>

              <Product /> 

            </PrivateRoute>

          } />

          <Route path="/sales" element={
            
            <PrivateRoute token={token}>

                <Sale />
            </PrivateRoute> } />

          <Route path="/login" element={<Login setToken={setToken}/>} /> 

        </Routes>


      </BrowserRouter>






    </>

  )
}

export default App
