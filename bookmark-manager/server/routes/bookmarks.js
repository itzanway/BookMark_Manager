const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.json');

const readData = async () => JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
const writeData = async (data) => await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

// GET /api/bookmarks (Updated with 'sort' for Most Visited)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query; // Added 'sort'
    const data = await readData();
    let bookmarks = data.bookmarks;

    if (category && category !== 'All') {
      bookmarks = bookmarks.filter(b => b.categoryId == category);
    }

    if (search) {
      const query = search.toLowerCase();
      bookmarks = bookmarks.filter(b => 
        b.title.toLowerCase().includes(query) || 
        (b.description && b.description.toLowerCase().includes(query)) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(query))) // Search tags too
      );
    }

    // Sort by Most Visited
    if (sort === 'most-visited') {
      bookmarks.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
    } else {
      // Default: Newest first
      bookmarks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const enrichedBookmarks = bookmarks.map(b => ({
      ...b,
      category: data.categories.find(c => c.id === b.categoryId)
    }));

    res.json({ bookmarks: enrichedBookmarks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

// POST /api/bookmarks (Updated with Tags)
router.post('/', async (req, res) => {
  try {
    const { title, url, description, categoryId, tags } = req.body; // Added tags

    if (!title || !url) return res.status(400).json({ error: "Required fields missing" });
    
    const data = await readData();
    const newBookmark = {
      id: Date.now(),
      title,
      url,
      description: description || "",
      categoryId: parseInt(categoryId),
      tags: tags || [], // Array of strings
      clickCount: 0,    // Initialize click tracking
      createdAt: new Date().toISOString()
    };

    data.bookmarks.push(newBookmark);
    await writeData(data);
    res.status(201).json(newBookmark);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// NEW: Track Clicks
router.post('/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const bookmark = data.bookmarks.find(b => b.id == id);
    
    if (bookmark) {
      bookmark.clickCount = (bookmark.clickCount || 0) + 1;
      await writeData(data);
      res.json({ newCount: bookmark.clickCount });
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// NEW: Import Bookmarks
router.post('/import', async (req, res) => {
  try {
    const { bookmarks } = req.body; // Expects array of bookmarks
    if (!Array.isArray(bookmarks)) return res.status(400).json({ error: "Invalid data" });

    const data = await readData();
    // Merge logic (simplified: just append with new IDs)
    const newEntries = bookmarks.map(b => ({
      ...b,
      id: Date.now() + Math.random(), // Ensure unique ID
      categoryId: b.categoryId || 1, // Default to Development if missing
      createdAt: new Date().toISOString()
    }));

    data.bookmarks = [...data.bookmarks, ...newEntries];
    await writeData(data);
    res.json({ message: `Imported ${newEntries.length} bookmarks` });
  } catch (err) {
    res.status(500).json({ error: "Import failed" });
  }
});

// DELETE remains the same...
router.delete('/:id', async (req, res) => { /* Same as before */ 
    const { id } = req.params;
    const data = await readData();
    data.bookmarks = data.bookmarks.filter(b => b.id != id);
    await writeData(data);
    res.json({ message: "Deleted" });
});

module.exports = router;