import express from "express";
import { ProductManager } from "./ProductManagerIntento";


const app = express()
const PORT = 5000

app.use(express.urlencoded({ extended: true }));

const manager = new ProductManager('/products.json')

app.get("/products", async (req, res) => {
 try {
    // Lee el archivo de productos
    const products = await manager.getProduct()
    // Obtiene el valor del parámetro 'limit' de la consulta
    const limit = req.query.limit
    // Verifica si se proporcionó el parámetro 'limit'
    if (limit) {
    // Convierte el límite a un número
        const limitNumber = parseInt(limit, 10)
    // Limita la cantidad de resultados según el valor proporcionado
        const limitedProducts = products.slice(0, limitNumber)
    // Envía los productos limitados como respuesta
        res.json({ products: limitedProducts})
    }else {
    // Si no se proporciona 'limit', envía todos los productos
    res.json({ products })
    }
 } catch (error){
    //maneja errores
    console.log("error al leer el archivo de productos")
    res.status(500).send("error interno del servidor")
 }
})

app.get("/products/:pid", async (req,res) =>{
    try {
        //lee el archivo de productos
        // const data = await fs.readFile("products.json", "utf-8")
        // const products = JSON.parse(data)
        //obtiene el id del producto desde req.params
        // const productId = parseInt(req.params.pid, 10)
        //busca el producto por su ID
        // const product = products.find((p) => p.id === productId)
        const {pid} = req.params
        const product = await manager.getProductById(number(pid))
        if(product) {
            //si se encuentra el producto lo envia como respuesta
            res.json({product})
        }else{
            //si no se encuentra el producto responde como mensaje
            res.status(404).json({error: "producto no encontrado"})
        }
    }catch (error){
        // maneja errores
        console.log("error al leer el archivo de productos");
        res.status(500).json({error: "error interno del servidor"})
    }
})

app.listen(PORT,() => console.log(`server listening on port ${PORT}`))