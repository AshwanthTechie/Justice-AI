import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import caseService from '../services/caseService';
import './DropdownSearch.css';

const DropdownSearch = ({ onCaseSelect, placeholder = "Search cases..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const searchResults = await caseService.searchCases(searchQuery);
      const resultsArray = Array.isArray(searchResults) ? searchResults.slice(0, 10) : [];
      setResults(resultsArray);
      setIsOpen(resultsArray.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      setError('Search failed. Please try again.');
      setResults([]);
      setIsOpen(false);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search by 300ms
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleCaseSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle case selection
  const handleCaseSelect = (caseItem) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (onCaseSelect) {
      onCaseSelect(caseItem);
    }
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setError('');
    setSelectedIndex(-1);
  };

  // Handle focus
  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="dropdown-search" ref={searchRef}>
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" size={16} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="dropdown-search-input"
        />
        {query && (
          <button className="clear-btn" onClick={handleClear}>
            <FiX size={16} />
          </button>
        )}
        {isLoading && <div className="loading-spinner"></div>}
      </div>

      {isOpen && (
        <div className="search-dropdown" ref={dropdownRef}>
          {error && (
            <div className="dropdown-error">
              {error}
            </div>
          )}
          
          {results.length > 0 && (
            <div className="dropdown-results">
              {results.map((caseItem, index) => (
                <div
                  key={caseItem.id || index}
                  className={`dropdown-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleCaseSelect(caseItem)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="case-title">{caseItem.title}</div>
                  <div className="case-meta">
                    {caseItem.court && (
                      <span className="case-court">{caseItem.court}</span>
                    )}
                    {caseItem.date && (
                      <span className="case-date">{caseItem.date}</span>
                    )}
                  </div>
                  {caseItem.snippet && (
                    <div className="case-snippet">
                      {caseItem.snippet.length > 100 
                        ? `${caseItem.snippet.substring(0, 100)}...` 
                        : caseItem.snippet
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && !error && results.length === 0 && query.trim() && (
            <div className="no-results">
              No cases found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownSearch;