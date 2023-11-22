import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];

    try {
      const carts = fs.readFileSync(this.path, "utf-8");
      this.carts = JSON.parse(carts);
      console.log("Archivo de carritos encontrado.");
    } catch {
      fs.writeFileSync(this.path, JSON.stringify(this.carts), "utf-8");
    }
  }

  async readFile() {
    const data = await fs.promises.readFile(this.path, 'utf-8');
    this.carts = JSON.parse(data);
  }

  async writeFile(data) {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
  }

  async createCart() {
    const cartId = Math.random().toString(36).substr(2, 9);
    const cartExists = this.carts.find(cart => cart.id === cartId);

    if (cartExists) {
      return this.createCart();
    }

    const newCart = {
      id: cartId,
      products: []
    };

    this.carts.push(newCart);
    await this.writeFile(this.carts);

    return newCart;
  }

  async getCartById(cartId) {
    await this.readFile();
    return this.carts.find(cart => cart.id === cartId);
  }

  async updateCart(cart) {
    await this.readFile();
    const index = this.carts.findIndex(c => c.id === cart.id);

    if (index !== -1) {
      this.carts[index] = cart;
      await this.writeFile(this.carts);
      return cart;
    }

    return null;
  }

  async addProductToCart(cartId, productId) {
    const cart = await this.getCartById(cartId);

    if (cart) {
      cart.products.push(productId);
      await this.updateCart(cart);
      return cart;
    }

    return null;
  }
}

export { CartManager };
