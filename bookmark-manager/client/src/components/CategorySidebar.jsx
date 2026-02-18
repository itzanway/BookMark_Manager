import React, { useState } from 'react';

const CategorySidebar = ({ categories, activeCategory, onSelectCategory, onAddCategory }) => {
  const [newCat, setNewCat] = useState('');

  const handleAdd = () => {
    if (newCat.trim()) {
      onAddCategory(newCat);
      setNewCat('');
    }
  };

  return (
    <div className="sidebar">
      <h3>Categories</h3>
      <ul>
        <li 
          className={!activeCategory ? 'active' : ''} 
          onClick={() => onSelectCategory(null)}
        >
          All Bookmarks
        </li>
        {categories.map(cat => (
          <li 
            key={cat.id} 
            className={activeCategory === cat.id ? 'active' : ''}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.name} ({cat.bookmarkCount || 0})
          </li>
        ))}
      </ul>
      <div className="add-category">
        <input 
          placeholder="+ Add Category" 
          value={newCat} 
          onChange={(e) => setNewCat(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()} 
        />
      </div>
    </div>
  );
};

export default CategorySidebar;