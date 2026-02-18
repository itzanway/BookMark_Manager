import React, { useState, useEffect } from 'react';
import CategorySidebar from './components/CategorySidebar';
import BookmarkCard from './components/BookmarkCard';
import './App.css'; // You'll need to create basic CSS for layout

const API_URL = 'http://localhost:5000/api';

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  
  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '', description: '', categoryId: '' });

  const fetchData = async () => {
    // Build query [cite: 254]
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
      <CategorySidebar 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
        onAddCategory={handleAddCategory}
      />
      
      <main className="main-content">
        <div className="top-bar">
          <input 
            type="text" 
            placeholder="Search bookmarks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setShowModal(true)}>+ Add New</button>
        </div>

        <div className="bookmark-grid">
          {bookmarks.map(b => (
            <BookmarkCard key={b.id} bookmark={b} onDelete={handleDelete} />
          ))}
        </div>
      </main>

      {/* Simple Modal Implementation [cite: 255] */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Bookmark</h2>
            <input placeholder="Title *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input placeholder="URL *" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
            <input placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div className="modal-actions">
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button onClick={handleSaveBookmark}>Save Bookmark</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;