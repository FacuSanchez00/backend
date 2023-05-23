const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const PORT = 8080;

const PRODUCTS_FILE_PATH = './productos.json';
const CARTS_FILE_PATH = './carrito.json';

// Utilidad para leer archivos JSON
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Utilidad para escribir archivos JSON
const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

// Manejador de rutas para productos
const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  const { limit } = req.query;

  let products = readJSONFile(PRODUCTS_FILE_PATH);

  if (limit) {
    products = products.slice(0, limit);
  }

  res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readJSONFile(PRODUCTS_FILE_PATH);
  const product = products.find((p) => p.id === pid);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

productsRouter.post('/', (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res
      .status(400)
      .json({ error: 'Title, description, code, price, stock and category are required' });
  }

  const newProduct = {
    id: uuidv4(),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  const products = readJSONFile(PRODUCTS_FILE_PATH);
  products.push(newProduct);
  writeJSONFile(PRODUCTS_FILE_PATH, products);

  res.json(newProduct);
});

productsRouter.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedFields = req.body;

  if (updatedFields.hasOwnProperty('id')) {
    delete updatedFields.id;
  }

  const products = readJSONFile(PRODUCTS_FILE_PATH);
  const productIndex = products.findIndex((p) => p.id === pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedProduct = { ...products[productIndex], ...updatedFields };
  products[productIndex] = updatedProduct;
  writeJSONFile(PRODUCTS_FILE_PATH, products);

  res.json(updatedProduct);
});

productsRouter.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readJSONFile(PRODUCTS_FILE_PATH);
  const updatedProducts = products.filter((p) => p.id !== pid);

  if (products.length === updatedProducts.length) {
    return res.status(404).json({ error: 'Product not found'
