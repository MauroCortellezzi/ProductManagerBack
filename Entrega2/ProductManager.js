const fs = require ('fs')

class ProductManager {
    constructor() {
        this.path = './productos.txt'
        this.products = []
    }

    static id = 0

    addProduct = async (title, description, price, image, code, stock) => {

        // agregamos el static id a newproduct para que sea autoincrementable
        ProductManager.id++

        let newProduct = {
            title,
            description,
            price,
            image,
            code,
            stock,
            //agrego la propiedad id con el productmanager.id++
            id: ProductManager.id
        }

        this.products.push(newProduct)

        // await fs.promises.writeFile(this.path, 'hola como estas')
        //cambiamos el hola por new product para enviar el producto al archivo

        //  await fs.promises.writeFile(this.path, newProduct)
        // en este caso tenemos q modificarlo para que se pase en modo json o recibimos un error
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"))

    }
// armamos readproducts para poder reutilizarlo en getproductsbyid
    readProducts = async () => {
        let respuesta = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(respuesta)
    }

    getProducts = async () => {
        let respuesta2 = await this.readProducts()
        return console.log(respuesta2)
    }

    getProductsById = async (id) => {
        let respuesta3 = await this.readProducts()
        if (!respuesta3.find(product => product.id === id)){
            console.log('producto no encontrado');
        }else{
            console.log(respuesta3.find(product => product.id === id))
        }

    }

    deleteProductsById = async (id) =>{
        let respuesta4 = await this.readProducts()
        let productFilter = respuesta4.filter(products => products.id != id)

        await fs.promises.writeFile(this.path, JSON.stringify(productFilter))
        console.log('producto eliminado')

    }


    updateProducts = async ({id, ...producto}) =>{
        await this.deleteProductsById(id)
        let productOld = await this.readProducts()

        let productsModif = [
            {id, ...producto},
            ...productOld
        ]
        await fs.promises.writeFile(this.path, JSON.stringify(productsModif))
    }
}

const productos = new ProductManager

productos.addProduct('titulo1', 'description1', 1000, 'imagen1', 'abc121', 1)
productos.addProduct('titulo2', 'description2', 2000, 'imagen2', 'abc122', 2)
productos.addProduct('titulo3', 'description3', 3000, 'imagen3', 'abc123', 3)

productos.getProducts()

productos.getProductsById(2)
productos.getProductsById(4)

productos.deleteProductsById(2)

productos.updateProducts({
    title: 'titulo3',
description: 'description3',
price: 4000,
image: 'imagen3',
code: 'abc123',
stock: 3,
id: 3
})