const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const products = readJSONFile(PRODUCTS_FILE_PATH);
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

module.exports = router;
