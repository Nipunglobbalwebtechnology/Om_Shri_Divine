const express = require('express');
const { getCategoryBySlug, createCategory, getAllCategories, deleteCategory, updateCategory } = require('../controllers/CategoryController');
const category = express.Router();

category.get('/' , getCategoryBySlug );
category.post('/' , createCategory);
category.get('/all' , getAllCategories);
category.delete('/:id' , deleteCategory);
category.put('/:id' , updateCategory);


module.exports = category