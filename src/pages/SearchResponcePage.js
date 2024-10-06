import React, { useEffect, useState } from 'react';
import FlightList from '../components/FlightList';

const SearchResponse = () => {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const searchResults = localStorage.getItem('searchResults');
    if (searchResults) {
      setFlights(JSON.parse(searchResults));
      localStorage.removeItem('searchResults');
    }
  }, []);

  return (
    <div className="search-response">
      <FlightList flights={flights} />
    </div>
  );
};

export default SearchResponse;