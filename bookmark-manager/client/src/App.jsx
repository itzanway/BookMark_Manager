import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
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
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '', description: '', categoryId: '' });

  const fetchData = async () => {
    let query = `${API_URL}/bookmarks?`;
    if (activeCategory) query += `category=${activeCategory}&`;
    if (search) query += `search=${search}`;
    
    const bRes = await fetch(query);
    const bData = await bRes.json();
    setBookmarks(bData.bookmarks);

    const cRes = await fetch(`${API_URL}/categories`);
    const cData = await cRes.json();
    setCategories(cData.categories);
  };

  useEffect(() => { fetchData(); }, [activeCategory, search]);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    await fetch(`${API_URL}/bookmarks/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleAddCategory = async (name) => {
    await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    fetchData();
  };

  const handleSaveBookmark = async () => {
    if (!formData.title || !formData.url) return alert("Title and URL required");
    await fetch(`${API_URL}/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setShowModal(false);
    setFormData({ title: '', url: '', description: '', categoryId: '' });
    fetchData();
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
              placeholder="Search bookmarks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Add New
          </button>
        </header>

        <div className="scroll-area">
          <div className="grid">
            {bookmarks.map(b => (
              <BookmarkCard key={b.id} bookmark={b} onDelete={handleDelete} />
            ))}
          </div>
          {bookmarks.length === 0 && (
            <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '3rem' }}>
              No bookmarks found. Add one to get started!
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