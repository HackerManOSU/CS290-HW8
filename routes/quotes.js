const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Read the contents of the quoteData.json file, parse it as JSON, and store it in the 'quoteData' constant
const quoteData = JSON.parse(fs.readFileSync(path.join(__dirname, '../quoteData.json'), 'utf8'));

router.get('/', (req, res) => {
  const categories = Object.keys(quoteData).map(key => quoteData[key].category);
  res.render('categories', { title: 'Quote Categories', categories });
});

// GET route that captures a category name from URL path
router.get('/:category', (req, res) => {
  const categoryKey = req.params.category.toLowerCase();
  const categoryData = quoteData[categoryKey];

  // Check if category data is not found and return 404 error message
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

  // Check if category data is not found and return 404 error message
  if (!categoryData) {
    return res.status(404).send('Category not found');
  }

  if (author && quote) {
    // Add new quote to list of quotes in category data
    categoryData.quote_list.push({ author, quote });
    // Re-render the 'category' template with the updated quotes list
    res.render('category', { title: categoryData.category, category: categoryData.category, quotes: categoryData.quote_list });
  } else {
    res.render('category', { title: categoryData.category, category: categoryData.category, quotes: categoryData.quote_list, error: 'Both author and quote are required' });
  }
});

module.exports = router;
