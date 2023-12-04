import express from "express";
import productsRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import path from "path"
import fs from "fs"

// socket server
import { Server } from "socket.io";

const app = express()
const PORT = 8080
const httpServer = app.listen(PORT,() => console.log(`server listening on port ${PORT}`))

//instanciar websocket
const socketServer = new Server(httpServer)

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//configuramos el engine
app.engine(
    "hbs",
    handlebars.engine({
      extname: "hbs",
      defaultLayout: "main",
    })
  );

//seteamos nuestro motor
app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

//public
app.use(express.static(`${__dirname}/public`));

// const productos = ["Producto 1", "Producto 2", "Producto 3"];

// Cargar productos desde el archivo JSON
const productosPath = path.join(__dirname, "../products.json");  
let productos = [];

try {
  const productosData = fs.readFileSync(productosPath, "utf-8");
  productos = JSON.parse(productosData);
} catch (error) {
  console.error("Error al cargar productos desde el archivo JSON:", error);
}

// Ruta para renderizar la página Home con la lista de productos
app.get("/home", (req, res) => {
    const context = {
      productos: productos,
    };
    res.render("home", context);
  });





  

  

// Routes
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)
// app.listen(PORT,() => console.log(`server listening on port ${PORT}`))