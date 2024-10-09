import React, { useState } from 'react';
import '../styles/SearchForm.css';

const SearchForm = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    originCountry: '',
    originCity: '',
    destinationCountry: '',
    destinationCity: '',
    localDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleCountryBlur = (name) => {
    if (searchParams[name]) {
      if (name === 'originCountry') {
        document.getElementById('originCity').focus();
      } else if (name === 'destinationCountry') {
        document.getElementById('destinationCity').focus();
      }
    }
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
            name='originCountry'
            placeholder="Country"
            value={searchParams.originCountry}
            onChange={handleInputChange}
            onBlur={() => handleCountryBlur('originCountry')}
            required
            className="form-input"
          />
          {searchParams.originCountry && (
            <>
              <label className="form-subtitle">Origin City</label>
              <input
                id='originCity'
                name='originCity'
                placeholder="City"
                value={searchParams.originCity}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </>
          )}
        </div>

        <div className="form-group">
          <label className="form-subtitle">Destination Country</label>
          <input
            name='destinationCountry'
            placeholder="Country"
            value={searchParams.destinationCountry}
            onChange={handleInputChange}
            onBlur={() => handleCountryBlur('destinationCountry')}
            required
            className="form-input"
          />
          {searchParams.destinationCountry && (
            <>
              <label className="form-subtitle">Destination City</label>
              <input
                id='destinationCity'
                name='destinationCity'
                placeholder="City"
                value={searchParams.destinationCity}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="localDate" className="form-subtitle">Date</label>
        <input
          type='date'
          id="localDate"
          name='localDate'
          value={searchParams.localDate}
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
