const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const quoteData = JSON.parse(fs.readFileSync(path.join(__dirname, '../quoteData.json'), 'utf8'));

router.get('/', (req, res) => {
  const categories = Object.keys(quoteData).map(key => quoteData[key].category);
  res.render('categories', { title: 'Quote Categories', categories });
});

router.get('/:category', (req, res) => {
  const categoryKey = req.params.category.toLowerCase();
  const categoryData = quoteData[categoryKey];

  if (!categoryData) {
    return res.status(404).send('Category not found');
  }

  const quotes = categoryData.quote_list;
  res.render('category', { title: categoryData.category, category: categoryData.category, quotes });
});

router.post('/:category', (req, res) => {
  const categoryKey = req.params.category.toLowerCase();
  const categoryData = quoteData[categoryKey];
  const { author, quote } = req.body;

  if (!categoryData) {
    return res.status(404).send('Category not found');
  }

  if (author && quote) {
    categoryData.quote_list.push({ author, quote });
    res.render('category', { title: categoryData.category, category: categoryData.category, quotes: categoryData.quote_list });
  } else {
    res.render('category', { title: categoryData.category, category: categoryData.category, quotes: categoryData.quote_list, error: 'Both author and quote are required' });
  }
});

module.exports = router;
