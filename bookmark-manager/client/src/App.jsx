import React, { useState, useEffect } from 'react';
import { Search, Plus, Moon, Sun, Download, Upload } from 'lucide-react';
import Sidebar from './components/Sidebar';
import BookmarkCard from './components/BookmarkCard';
import Modal from './components/Modal';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'most-visited'
  
  // Theme State
  const [theme, setTheme] = useState('light');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '', description: '', categoryId: '', tags: '' });

  // 1. Keyboard Shortcuts (Ctrl+N / Cmd+N to add new)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setShowModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 2. Dark Mode Effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Fetch Data (Debounced search isn't strictly necessary for local, but good for API)
  const fetchData = async () => {
    try {
      let query = `${API_URL}/bookmarks?sort=${sortBy}&`;
      if (activeCategory) query += `category=${activeCategory}&`;
      if (search) query += `search=${encodeURIComponent(search)}`;
      
      const bRes = await fetch(query);
      const bData = await bRes.json();
      setBookmarks(bData.bookmarks || []);

      const cRes = await fetch(`${API_URL}/categories`);
      const cData = await cRes.json();
      setCategories(cData.categories || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => { fetchData(); }, [activeCategory, search, sortBy]);

  // 3. Click Tracking
  const handleLinkClick = async (id) => {
    try {
      await fetch(`${API_URL}/bookmarks/${id}/click`, { method: 'POST' });
      // We don't await fetchData here to keep the UI snappy for the user redirect
      fetchData(); 
    } catch (error) {
      console.error("Tracking error:", error);
    }
  };

  // 4. Import / Export
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "bookmarks_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const text = await file.text();
      try {
        const json = JSON.parse(text);
        // Basic validation
        if (!Array.isArray(json)) throw new Error("Invalid format");

        await fetch(`${API_URL}/bookmarks/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookmarks: json })
        });
        alert("Import successful!");
        fetchData();
      } catch (err) {
        alert("Invalid JSON file. Please upload an array of bookmarks.");
      }
    };
    input.click();
  };

  // Save Bookmark
  const handleSaveBookmark = async () => {
    if (!formData.title || !formData.url) return alert("Title and URL required");
    
    // Convert comma-separated tags string to array
    const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [];

    try {
      await fetch(`${API_URL}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tags: tagsArray })
      });
      setShowModal(false);
      setFormData({ title: '', url: '', description: '', categoryId: '', tags: '' });
      fetchData();
    } catch (error) {
      alert("Failed to save bookmark");
    }
  };

  // Delete Bookmark
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this bookmark?")) return;
    try {
      await fetch(`${API_URL}/bookmarks/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      alert("Failed to delete bookmark");
    }
  };

  // Add Category
  const handleAddCategory = async (name) => {
    try {
      await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      fetchData();
    } catch (error) {
      alert("Failed to create category");
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelect={setActiveCategory} 
        onAdd={handleAddCategory}
      />
      
      <main className="main-content">
        <header className="top-bar">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input"
              placeholder="Search bookmarks, tags, descriptions..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
             {/* Sort Dropdown */}
             <select 
              className="form-select" 
              style={{ width: 'auto', paddingRight: '2rem' }}
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="most-visited">Most Visited</option>
            </select>

            {/* Action Buttons */}
            <button className="theme-toggle" onClick={handleExport} title="Export JSON">
              <Download size={18}/>
            </button>
            <button className="theme-toggle" onClick={handleImport} title="Import JSON">
              <Upload size={18}/>
            </button>

            {/* Dark Mode Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark Mode">
              {theme === 'light' ? <Moon size={18}/> : <Sun size={18}/>}
            </button>

            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} /> Add New
            </button>
          </div>
        </header>

        <div className="scroll-area">
          <div className="grid">
            {bookmarks.map(b => (
              <BookmarkCard 
                key={b.id} 
                bookmark={b} 
                onDelete={handleDelete}
                onClick={handleLinkClick} 
              />
            ))}
          </div>
          
          {bookmarks.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
              No bookmarks found. <br/> Use <strong>Ctrl + N</strong> to add one!
            </div>
          )}
        </div>
      </main>

      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={handleSaveBookmark}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
      />
    </div>
  );
}

export default App;