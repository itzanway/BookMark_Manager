import React from 'react';

const Modal = ({ isOpen, onClose, onSave, formData, setFormData, categories }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Add New Bookmark</h2>
        
        <div className="form-group">
          <label>Title *</label>
          <input 
            className="form-input" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="e.g. GitHub"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>URL *</label>
          <input 
            className="form-input" 
            value={formData.url} 
            onChange={e => setFormData({...formData, url: e.target.value})}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select 
            className="form-select"
            value={formData.categoryId} 
            onChange={e => setFormData({...formData, categoryId: e.target.value})}
          >
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            className="form-input" 
            rows="3"
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="What is this for?"
          />
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSave}>Save Bookmark</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;