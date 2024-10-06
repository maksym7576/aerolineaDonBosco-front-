import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import SearchService from '../services/SearchService';

const SearchPage = () => {
  const navigate = useNavigate();

  const handleSearch = async (searchParams) => {
    try {
      const flightsData = await SearchService.searchFlights(searchParams);
      localStorage.setItem('searchResults', JSON.stringify(flightsData));
      navigate('/found');
    } catch (error) {
      console.error('Error searching flights:', error);
    }
  };

  return (
    <div className="search-page">
      <SearchForm onSearch={handleSearch} />
    </div>
  );
};

export default SearchPage;