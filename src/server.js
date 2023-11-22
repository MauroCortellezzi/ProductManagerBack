import express from "express";
import productsRouter from "./routes/products.router.js"
import cartRouter from "./routes/cart.router.js"



const app = express()
const PORT = 5000

app.use(express.urlencoded({ extended: true }));





// Routes
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)
app.listen(PORT,() => console.log(`server listening on port ${PORT}`))