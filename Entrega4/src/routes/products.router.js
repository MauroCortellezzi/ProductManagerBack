import { Router } from "express";
import { ProductManager } from "../ProductManagerIntento.js";

const router = Router()

const manager = new ProductManager('/products.json')

router.get("/", async (req, res) => {
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

router.get("/:pid", async (req,res) =>{
    try {
        //lee el archivo de productos
        // const data = await fs.readFile("products.json", "utf-8")
        // const products = JSON.parse(data)
        //obtiene el id del producto desde req.params
        // const productId = parseInt(req.params.pid, 10)
        //busca el producto por su ID
        // const product = products.find((p) => p.id === productId)
        const {pid} = req.params
        const product = await manager.getProductById(Number(pid))
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

let nextProductId = 1 // variable para generar ids unicos

//ruta para agregar un nuevo producto

router.post("/", async (req, res)=> {
    try {
      console.log(req.body)
        //obtenemos datos 
        const { title, description, code, price, status, stock, category, thumbnail } = req.body;

        // verificamos que esten los datos
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
          }

        // Crea el nuevo producto con un ID autogenerado
        const newProduct = {
        id: nextProductId++,
        title,
        description,
        code,
        price: parseFloat(price), // Convierte el precio a número
        status,
        stock: parseInt(stock, 10), // Convierte el stock a número entero
        category,
        thumbnail
      };

       // Agrega el nuevo producto al archivo de productos
        await manager.addProduct(newProduct);
        res.status(201).json({ message: "Producto agregado exitosamente.", product: newProduct });

    }catch (error) {
        console.error("Error al agregar el nuevo producto:", error);
        res.status(500).json({ error: "Error interno del servidor." });
      }


})

router.put("/:pid", async ( req,res ) =>{
    try {
        // Obtén el ID del parámetro de la solicitud
        const productId = parseInt(req.params.pid, 10);

        // Obtén los campos a actualizar desde el cuerpo de la solicitud
        const { title, description, code, price, status, stock, category, thumbnail } = req.body;

        // Verifica si el producto con el ID proporcionado existe
        const existingProduct = await manager.getProductById(productId);

        if (existingProduct !== "Not found id") {
            // Crea un objeto con los campos a actualizar
            const updatedFields = {
              title: title || existingProduct.title,
              description: description || existingProduct.description,
              code: code || existingProduct.code,
              price: price || existingProduct.price,
              status: status || existingProduct.status,
              stock: stock || existingProduct.stock,
              category: category || existingProduct.category,
              thumbnail: thumbnail || existingProduct.thumbnail
            };
        // Actualiza el producto en el archivo de productos
        await manager.updateProduct({ id: productId, ...updatedFields });
        // Devuelve el producto actualizado como respuesta
        res.json({ message: "Producto actualizado exitosamente.", product: { id: productId, ...updatedFields } });
        } else {
        // Si no se encuentra el producto, responde con un mensaje de error
        res.status(404).json({ error: "Producto no encontrado." });
    }
} catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Ruta para eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
    try {
      // Obtén el ID del parámetro de la solicitud
      const productId = parseInt(req.params.pid, 10);
  
      // Elimina el producto por ID
      await manager.deleteProductById(productId);
  
      // Devuelve un mensaje indicando que el producto fue eliminado
      res.json({ message: "Producto eliminado exitosamente.", deletedProductId: productId });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  });

  router.post("/:cartId/product/:productId", async (req, res) => {
    const { cartId, productId } = req.params;
  
    try {
      const updatedCart = await cartManager.addProductToCart(cartId, productId);
      const product = {
        id: productId,
        quantity: 1  
      };
      res.json({ message: `Producto con ID ${productId} agregado al carrito.`, product, cart: updatedCart });
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  });




export default router