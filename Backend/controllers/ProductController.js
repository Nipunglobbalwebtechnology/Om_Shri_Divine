const { 
  addProduct, 
  getProductBySlug, 
  listProducts, 
  getProductByCategory, 
  searchProduct: searchProductModel,
  deleteProduct: deleteProductModel, 
  updateProduct: updateProductModel,
  getAllProducts: getAllProductsModel 
} = require('../models/Products');

const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      image_url,
      category_id,
      price,
      old_price,
      purpose,
      bead,
      mukhi,
      plating,
      review_count,
      rating,
      is_active = 1
    } = req.body;

    if (!title || !slug || !image_url || !category_id || !price) {
      return res.status(400).json({ message: 'title, slug, image_url, category_id, price are required' });
    }

    const { id } = await addProduct({
      title, slug, image_url, category_id, price, old_price, purpose, bead, mukhi, plating, review_count, rating, is_active
    });

    const created = await getProductBySlug(slug);
    return res.status(201).json({ id, product: created });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const row = await getProductBySlug(slug);
    if (!row) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(row);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};

const list = async (req, res) => {
  try {
    const { category_id, category_slug } = req.query;
    const filters = {};
    if (category_slug) filters.category_slug = category_slug;
    if (category_id) filters.category_id = Number(category_id);
    const rows = await listProducts(filters);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list products', error: err.message });
  }
};

const getByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const rows = await getProductByCategory(Number(category_id));
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list products', error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const rows = await getAllProductsModel();
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list products', error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const result = await deleteProductModel(Number(product_id));
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const result = await updateProductModel(Number(product_id), req.body);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { searchTerm, categoryId } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({ message: 'searchTerm is required' });
    }
    
    const results = await searchProductModel({
      searchTerm,
      categoryId: categoryId ? Number(categoryId) : null
    });
    
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ 
      message: 'Failed to search products', 
      error: err.message 
    });
  }
};

module.exports = { 
  createProduct, 
  getBySlug, 
  list, 
  getByCategory, 
  getAllProducts, 
  deleteProduct, 
  updateProduct,
  searchProducts 
};
