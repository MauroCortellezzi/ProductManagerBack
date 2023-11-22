import { Router } from "express";
import { CartManager } from "../CartManager.js";

const router = Router();
const cartManager = new CartManager('./carts.json');

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json({ message: "Carrito creado exitosamente.", cart: newCart });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

router.get("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  const cart = await cartManager.getCartById(cartId);

  if (cart) {
    res.json({ message: `Productos del carrito con ID ${cartId}.`, products: cart.products });
  } else {
    res.status(404).json({ error: "Carrito no encontrado." });
  }
});

router.post("/:cartId/product/:productId", async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    const updatedCart = await cartManager.addProductToCart(cartId, productId);
    const product = {
      id: productId,
      quantity: 1  // Se asume que se agrega de uno en uno, puedes ajustar según tus necesidades.
    };
    res.json({ message: `Producto con ID ${productId} agregado al carrito.`, product, cart: updatedCart });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

export default router;
