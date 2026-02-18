import React from 'react';

const BookmarkCard = ({ bookmark, onDelete }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{bookmark.title}</h3>
        <span className="category-tag">{bookmark.category?.name}</span>
      </div>
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="url-link">
        {bookmark.url}
      </a>
      <p>{bookmark.description}</p>
      <div className="actions">
        <button onClick={() => onDelete(bookmark.id)} className="delete-btn">🗑 Delete</button>
      </div>
    </div>
  );
};

export default BookmarkCard;