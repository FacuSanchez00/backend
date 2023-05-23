const express = require('express');
const router = express.Router();

router.post('/products', (req, res) => {
  // Lógica para agregar un producto
  // ...

  // Emitir evento de WebSocket para agregar el producto
  io.emit('addProduct', product);

  res.json(product);
});

router.delete('/products/:pid', (req, res) => {
  const { pid } = req.params;
  // Lógica para eliminar un producto
  // ...

  // Emitir evento de WebSocket para eliminar el producto
  io.emit('deleteProduct', pid);

  res.json({ message: 'Product deleted' });
});

module.exports = router;
