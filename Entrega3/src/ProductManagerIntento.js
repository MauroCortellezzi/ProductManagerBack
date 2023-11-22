import fs from "fs"

class ProductManager {
  constructor(path) {
    this.path = path;
    try {
      let products = fs.readFileSync(this.path, "utf-8");
      if (products) {
        console.log("archivo encontrado");
      }
      this.products = JSON.parse(products);
    } catch {
      this.products = [];
      fs.writeFileSync(this.path, JSON.stringify(this.products), "utf-8");
    }
  }

 

  readFile = async () => {
    const data =  await fs.promises.readFile(this.path, 'utf-8')
    this.products = JSON.parse(data)
  };

  writeFile = async (data) => {
    await fs.promises.writeFile(this.path, JSON.stringify(data, null, "\t"));
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    await this.readFile();
    let codeExists = false;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].code === code) {
        console.log(`el codigo ${code} esta repetido`);
        codeExists = true;
        break;
      }
    }
    if (!codeExists) {
      let newProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      if (!Object.values(newProduct).includes(undefined)) {
       
        const id = this.products[this.products.length -1] ?  this.products[this.products.length -1].id +1 : 1
        this.products.push({
          ...newProduct,
          id: id 
        });
      } else {
        console.log("todos los campos son requeridos");
      }
      

      await this.writeFile(this.products);
      
    } else {
      console.log(`el codigo ${code} esta repetido `);
    }
  };

  async getProduct() {
    await this.readFile();
    return this.products;
  }

  exists(id) {
    return this.products.find((product) => product.id === id);
  }

  
  async getProductById(id) {
    await this.readFile();
    return !this.exists(id) ? "Not found id " : this.exists(id);
  }

  async deleteProductById(id) {
    await this.readFile();
    if (this.exists(id)) {
      const productFilter = this.products.filter(
        (products) => products.id != id
      );
      await this.writeFile(productFilter);
      console.log("producto eliminado");
    } else {
      console.log("No se encontro el id del producto");
    }
  }

  async updateProduct({id, ...product}) {
    if (this.exists(id)){
      await this.deleteProductById(id)
      await this.readFile()
      let productModif = this.products
      productModif.push({id,...product})
     
      await this.writeFile(productModif)
      console.log(productModif)
    }else{
      console.log('no se encontro el id')
    }
   
  }

}


const products = new ProductManager("./products.json");
//primera llamada = arreglo vacio

// const testing = async () => {
//   await products.addProduct(
//     "titulo1",
//     "description1",
//     1000,
//     "thumbnail1",
//     "abc123",
//     5
//   );
//   await products.addProduct(
//     "titulo2",
//     "description2",
//     1000,
//     "thumbnail2",
//     "abc125",
//     5
//   );
//   await products.addProduct(
//     "titulo3",
//     "description3",
//     1000,
//     "thumbnail3",
//     "abc126",
//     5
//   );
  // //segunda llamada = arreglo con producto
  // const getData = await products.getProduct();
  // console.log(getData);
//   console.log('Busca producto 2')
//   const getDataById = await products.getProductById(2);
//   console.log(getDataById);
//   console.log("---------------------");
//   console.log('Busca producto que no existe')
//   const getDataById3 = await products.getProductById(3);
//   console.log(getDataById3);
  
  
//   console.log("---------------------");


//   await products.deleteProductById(1);
//   await products.deleteProductById(3)

//   console.log("---------------------");

//   await products.updateProduct({
//     title: 'titulo45',
// description: 'description3',
// price: 4000,
// image: 'imagen3',
// code: 'abc123',
// stock: 3,
// id: 25
// })

// };


// testing();

export { ProductManager }
