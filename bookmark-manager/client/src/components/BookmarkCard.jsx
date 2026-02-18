import React from 'react';
import { Trash2, ExternalLink } from 'lucide-react';

const BookmarkCard = ({ bookmark, onDelete }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{bookmark.title}</h3>
      </div>
      
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="card-link">
        {bookmark.url} <ExternalLink size={12} style={{ marginLeft: '4px' }}/>
      </a>
      
      <p className="card-desc">
        {bookmark.description || "No description provided."}
      </p>

      <div className="card-footer">
        <span className="tag">{bookmark.category?.name || 'Uncategorized'}</span>
        <button 
          className="btn-icon delete" 
          onClick={() => onDelete(bookmark.id)}
          title="Delete Bookmark"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default BookmarkCard;