import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch, placeholder = "Search news..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      }
      setSearchQuery('');
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsFocused(false);
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className={`relative flex items-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft border transition-all duration-300 ${
        isFocused 
          ? 'ring-2 ring-blue-500/50 shadow-large border-blue-300 scale-105' 
          : 'border-gray-200/50 hover:border-gray-300 hover:shadow-medium'
      }`}>
        <div className={`absolute left-5 transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}>
          <FaSearch className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full pl-14 pr-12 py-4 rounded-2xl focus:outline-none text-gray-800 placeholder:text-gray-400 bg-transparent text-lg font-medium"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label="Clear search"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

