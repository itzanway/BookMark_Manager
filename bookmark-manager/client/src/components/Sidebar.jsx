import React, { useState } from 'react';
import { Bookmark, FolderPlus, Layers } from 'lucide-react'; // Icons

const Sidebar = ({ categories, activeCategory, onSelect, onAdd }) => {
  const [newCat, setNewCat] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newCat.trim()) {
      onAdd(newCat);
      setNewCat('');
    }
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <Bookmark size={24} fill="#2563eb" />
        <span>Manager</span>
      </div>

      <div className="nav-header">Library</div>
      <ul className="category-list">
        <li 
          className={`category-item ${!activeCategory ? 'active' : ''}`}
          onClick={() => onSelect(null)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} /> All Bookmarks
          </span>
        </li>
        {categories.map(cat => (
          <li 
            key={cat.id} 
            className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
          >
            <span>{cat.name}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{cat.bookmarkCount}</span>
          </li>
        ))}
      </ul>

      <div className="nav-header" style={{ marginTop: 'auto' }}>New Category</div>
      <div style={{ position: 'relative' }}>
        <input 
          className="add-category-input"
          placeholder="Type & Enter..."
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <FolderPlus size={16} style={{ position: 'absolute', right: '10px', top: '24px', color: '#94a3b8' }} />
      </div>
    </aside>
  );
};

export default Sidebar;