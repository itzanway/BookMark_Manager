const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

const readData = async () => {
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

const writeData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const data = await readData();
    
    // Calculate bookmark counts for each category
    const categoriesWithCounts = data.categories.map(cat => ({
      ...cat,
      bookmarkCount: data.bookmarks.filter(b => b.categoryId === cat.id).length
    }));

    res.json({ categories: categoriesWithCounts });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const data = await readData();

    // Check for duplicates (Optional but good practice)
    if (data.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = {
      id: Date.now(),
      name
    };

    data.categories.push(newCategory);
    await writeData(data);

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

module.exports = router;