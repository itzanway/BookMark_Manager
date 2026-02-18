const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to data.json (going up one level from 'routes' folder)
const DATA_FILE = path.join(__dirname, '..', 'data.json');

// Helper functions
const readData = async () => {
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

const writeData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET /api/bookmarks (Search & Filter)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const data = await readData();
    let bookmarks = data.bookmarks;

    // Filter by Category
    if (category && category !== 'All') {
      bookmarks = bookmarks.filter(b => b.categoryId == category);
    }

    // Search by Title or Description
    if (search) {
      const query = search.toLowerCase();
      bookmarks = bookmarks.filter(b => 
        b.title.toLowerCase().includes(query) || 
        (b.description && b.description.toLowerCase().includes(query))
      );
    }

    // Join with Category Name (for frontend display)
    const enrichedBookmarks = bookmarks.map(b => {
      const cat = data.categories.find(c => c.id === b.categoryId);
      return { ...b, category: cat };
    });

    res.json({ bookmarks: enrichedBookmarks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

// POST /api/bookmarks (Create)
router.post('/', async (req, res) => {
  try {
    const { title, url, description, categoryId } = req.body;

    // Validation
    if (!title || !url) {
      return res.status(400).json({ error: "Title and URL are required" });
    }
    try { new URL(url); } catch (_) { 
      return res.status(400).json({ error: "Invalid URL format" }); 
    }

    const data = await readData();
    
    const newBookmark = {
      id: Date.now(),
      title,
      url,
      description: description || "",
      categoryId: parseInt(categoryId),
      createdAt: new Date().toISOString()
    };

    data.bookmarks.push(newBookmark);
    await writeData(data);

    res.status(201).json(newBookmark);
  } catch (err) {
    res.status(500).json({ error: "Failed to save bookmark" });
  }
});

// DELETE /api/bookmarks/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    
    // Filter out the bookmark with the given ID
    const initialLength = data.bookmarks.length;
    data.bookmarks = data.bookmarks.filter(b => b.id != id);

    if (data.bookmarks.length === initialLength) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    await writeData(data);
    res.json({ message: "Bookmark deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete bookmark" });
  }
});

module.exports = router;