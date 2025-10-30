const { addCategory, getCategory } = require('../models/Categories');

const createCategory = async (req, res) => {
  try {
    const { name, slug, parent_id = null, sort_order = 0, is_active = 1 } = req.body ;
    if (!name || !slug) {
      return res.status(400).json({ message: 'name and slug are required' });
    }
    const { id } = await addCategory({ name, slug, parent_id, sort_order, is_active });
    const created = await getCategory({ slug });
    return res.status(201).json('category created', { id, category: created });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create category', error: err.message });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const row = await getCategory({ slug });
    if (!row) return res.status(404).json({ message: 'Category not found' });
    return res.status(200).json('category found',row);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch category', error: err.message });
  }
};

const listCategories = async (req, res) => {
  try {
    let { parent_id } = req.query;
    if (typeof parent_id !== 'undefined') {
      if (parent_id === 'null' || parent_id === '') parent_id = null;
      else parent_id = Number(parent_id);
      const rows = await getCategory({ parent_id });
      return res.status(200).json('category found',rows);
    }
    const rows = await getCategory({});
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list categories', error: err.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const rows = await getCategory({});
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list categories', error: err.message });
  }
};

const deleteCategory = async (req,res)=>{
  try {
    const { id } = req.params;
    const deleted = await deleteCategory(id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    return res.status(200).json('category deleted');
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
};

const updateCategory = async (req,res)=>{
  try {
    const { id } = req.params;
    const updated = await updateCategory(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    return res.status(200).json('category updated');
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update category', error: err.message });
  }
};


module.exports = { createCategory, getCategoryBySlug, listCategories, getAllCategories , deleteCategory , updateCategory};
