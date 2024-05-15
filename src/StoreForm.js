// StoreForm.js
import React, { useState } from 'react';

const StoreForm = ({ onAddStore }) => {
  const [name, setName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const store = {
      name,
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    };
    onAddStore(store);
    setName('');
    setLongitude('');
    setLatitude('');
  };

  return (
    <div className="form">
      <h2>Add Store</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Store Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          step="any"
          required
        />
        <input
          type="number"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          step="any"
          required
        />
        <button type="submit">Add Store</button>
      </form>
    </div>
  );
};

export default StoreForm;
