const express = require('express');
const { createProduct, list, getBySlug, getByCategory, getAllProducts, searchProducts } = require('../controllers/ProductController');
const { deleteProduct, updateProduct } = require('../controllers/ProductController');

const product = express.Router();

// List products (optional filters: ?category_slug=... or ?category_id=...)
product.get('/', list);

// Create a product
product.post('/', createProduct);

// Static and specific routes should come before dynamic param routes
product.get('/view', getAllProducts);
product.get('/category/:category_id', getByCategory);

// Get a product by slug (kept last to avoid catching static paths)
product.get('/:slug', getBySlug);
product.put('/:product_id', updateProduct);
product.delete('/:product_id', deleteProduct);
product.get('/search', searchProducts);

module.exports = product;
