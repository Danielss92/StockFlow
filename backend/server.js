//1 - servidor express, arquivo Principal

//const express = require("express");
import express from "express"; //utilizando ES module
import userRoutes from "./routes/userRoutes.js";

import productRoutes from "./routes/productRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import cors from "cors";

const app = express();

app.use(cors());// deve ficar antes das rotas
app.use(express.json());
app.use(userRoutes); // Express, use as rotas que estão dentro desse userRoutes
app.use(productRoutes);
app.use(categoryRouter);
app.use(saleRoutes);


const PORT = 3000;

//lista de produtos

app.get("/", (req, res) => {
  res.send("GerenciaEstoque API funcionando!");
});







app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
