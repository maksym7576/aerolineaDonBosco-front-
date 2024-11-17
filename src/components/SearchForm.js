import React, { useState } from 'react';
import '../styles/SearchForm.css';

const SearchForm = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    originCountry: '',
    originCity: '',
    destinationCountry: '',
    destinationCity: '',
    startLocalDate: '',
    finishLocalDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Search Flights</h2>
      <div className="form-container">
        <div className="form-group">
          <label className="form-subtitle">Origin Country</label>
          <input
            name="originCountry"
            placeholder="Country"
            value={searchParams.originCountry}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-subtitle">Origin City</label>
          <input
            name="originCity"
            placeholder="City"
            value={searchParams.originCity}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-subtitle">Destination Country</label>
          <input
            name="destinationCountry"
            placeholder="Country"
            value={searchParams.destinationCountry}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-subtitle">Destination City</label>
          <input
            name="destinationCity"
            placeholder="City"
            value={searchParams.destinationCity}
            onChange={handleInputChange}
            required
            className="form-input"
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="startLocalDate" className="form-subtitle">Start Date</label>
        <input
          type="date"
          id="startLocalDate"
          name="startLocalDate"
          value={searchParams.startLocalDate}
          onChange={handleInputChange}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="finishLocalDate" className="form-subtitle">Finish Date</label>
        <input
          type="date"
          id="finishLocalDate"
          name="finishLocalDate"
          value={searchParams.finishLocalDate}
          onChange={handleInputChange}
          className="form-input"
        />
      </div>
      <button type="submit" className="form-button">
        Search
      </button>
    </form>
  );
};

export default SearchForm;
