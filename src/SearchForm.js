// SearchForm.js
import React, { useState } from 'react';

const SearchForm = ({ onSearchStore }) => {
  const [searchName, setSearchName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchStore(searchName);
    setSearchName('');
  };

  return (
    <div className="form">
      <h2>Search Store</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Store Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchForm;
