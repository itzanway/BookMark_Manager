const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Helper: Read Data
const readData = async () => {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
};

// Helper: Write Data
const writeData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// --- ROUTES ---

// GET /api/bookmarks (Supports search & filter) [cite: 79-81]
app.get('/api/bookmarks', async (req, res) => {
    const { category, search } = req.query;
    const data = await readData();
    let bookmarks = data.bookmarks;

    if (category && category !== 'All') {
        bookmarks = bookmarks.filter(b => b.categoryId == category);
    }
    if (search) {
        const query = search.toLowerCase();
        bookmarks = bookmarks.filter(b => 
            b.title.toLowerCase().includes(query) || 
            b.description.toLowerCase().includes(query)
        );
    }
    
    // Join category info for display
    const enriched = bookmarks.map(b => ({
        ...b,
        category: data.categories.find(c => c.id == b.categoryId)
    }));

    res.json({ bookmarks: enriched });
});

// POST /api/bookmarks [cite: 96]
app.post('/api/bookmarks', async (req, res) => {
    const { title, url, description, categoryId } = req.body;
    
    // URL Validation [cite: 256]
    try { new URL(url); } catch (_) { return res.status(400).json({ error: "Invalid URL" }); }
    if (!title || !url) return res.status(400).json({ error: "Title and URL required" });

    const data = await readData();
    const newBookmark = {
        id: Date.now(), // Simple ID generation
        title,
        url,
        description: description || "",
        categoryId: parseInt(categoryId),
        createdAt: new Date().toISOString()
    };

    data.bookmarks.push(newBookmark);
    await writeData(data);
    res.status(201).json(newBookmark);
});

// DELETE /api/bookmarks/:id [cite: 119]
app.delete('/api/bookmarks/:id', async (req, res) => {
    const data = await readData();
    data.bookmarks = data.bookmarks.filter(b => b.id != req.params.id);
    await writeData(data);
    res.json({ message: "Deleted" });
});

// GET /api/categories [cite: 122]
app.get('/api/categories', async (req, res) => {
    const data = await readData();
    // Calculate counts [cite: 126]
    const categories = data.categories.map(c => ({
        ...c,
        bookmarkCount: data.bookmarks.filter(b => b.categoryId === c.id).length
    }));
    res.json({ categories });
});

// POST /api/categories [cite: 131]
app.post('/api/categories', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });
    
    const data = await readData();
    const newCat = { id: Date.now(), name };
    data.categories.push(newCat);
    await writeData(data);
    res.json(newCat);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));