import React from 'react';
import { Trash2, ExternalLink, Eye } from 'lucide-react';

const BookmarkCard = ({ bookmark, onDelete, onClick }) => {
  // Use Google's service to get favicon from domain
  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={getFaviconUrl(bookmark.url)} alt="" className="favicon" />
          <h3 className="card-title">{bookmark.title}</h3>
        </div>
      </div>
      
      {/* Click Tracking Wrapper */}
      <a 
        href={bookmark.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="card-link"
        onClick={() => onClick(bookmark.id)} // Track click
      >
        {bookmark.url} <ExternalLink size={12} style={{ marginLeft: '4px' }}/>
      </a>
      
      <p className="card-desc">
        {bookmark.description}
      </p>

      {/* Tags Display */}
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="tags-container">
          {bookmark.tags.map((tag, idx) => (
            <span key={idx} className="tag-pill">#{tag}</span>
          ))}
        </div>
      )}

      <div className="card-footer">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="tag">{bookmark.category?.name}</span>
          {/* View Count Badge */}
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Eye size={12} /> {bookmark.clickCount || 0}
          </span>
        </div>
        
        <button className="btn-icon delete" onClick={() => onDelete(bookmark.id)}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default BookmarkCard;