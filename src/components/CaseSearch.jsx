import React, { useState, useEffect } from 'react';
import { FiSearch, FiExternalLink, FiCalendar, FiMapPin } from 'react-icons/fi';
import caseService from '../services/caseService';
import SimilarCases from './SimilarCases';
import './CaseSearch.css';

const CaseSearch = ({ onCaseSelect, isVisible, onClose, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  // Auto-search when modal opens with initial query
  useEffect(() => {
    if (isVisible && initialQuery && initialQuery.trim()) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [isVisible, initialQuery]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setCases([]);
    setSelectedCase(null);

    try {
      const results = await caseService.searchCases(searchQuery);
      setCases(Array.isArray(results) ? results : []);
    } catch (err) {
      setError('Failed to search cases. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleCaseClick = async (caseId) => {
    try {
      const caseDetails = await caseService.getCaseDetails(caseId);
      setSelectedCase(caseDetails);
    } catch (err) {
      setError('Failed to load case details.');
      console.error('Case details error:', err);
    }
  };

  const handleUseCase = () => {
    if (selectedCase && onCaseSelect) {
      onCaseSelect(selectedCase);
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="case-search-overlay">
      <div className="case-search-modal">
        <div className="case-search-header">
          <h3>Search Legal Cases</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for cases, laws, or legal topics..."
              className="search-input"
            />
            <button type="submit" disabled={isLoading} className="search-btn">
              <FiSearch size={20} />
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            Searching cases...
          </div>
        )}

        {!isLoading && cases.length > 0 && (
          <div className="cases-list">
            <h4>Search Results ({cases.length})</h4>
            {cases.map((caseItem, index) => (
              <div
                key={caseItem.id || index}
                className={`case-item ${selectedCase?.id === caseItem.id ? 'selected' : ''}`}
                onClick={() => handleCaseClick(caseItem.id)}
              >
                <div className="case-header">
                  <h5 className="case-title">{caseItem.title}</h5>
                  <FiExternalLink className="external-link" />
                </div>
                <div className="case-meta">
                  {caseItem.court && (
                    <span className="case-court">
                      <FiMapPin size={14} />
                      {caseItem.court}
                    </span>
                  )}
                  {caseItem.date && (
                    <span className="case-date">
                      <FiCalendar size={14} />
                      {caseItem.date}
                    </span>
                  )}
                </div>
                {caseItem.snippet && (
                  <div className="case-details-expanded">
                    <p className="case-snippet">{caseItem.snippet}</p>
                    {caseItem.url && (
                      <div className="case-additional-info">
                        <small>
                          <strong>Case ID:</strong> {caseItem.id}<br/>
                          <strong>Source:</strong> Indian Kanoon<br/>
                          <a href={caseItem.url} target="_blank" rel="noopener noreferrer" className="case-link">
                            View Full Case →
                          </a>
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedCase && (
          <div className="case-details">
            <h4>Complete Case Details</h4>
            <div className="case-details-content">
              <h5>{selectedCase.title}</h5>
              <div className="case-meta-detailed">
                <div className="meta-row">
                  {selectedCase.court && (
                    <span className="case-court">
                      <FiMapPin size={14} />
                      <strong>Court:</strong> {selectedCase.court}
                    </span>
                  )}
                  {selectedCase.date && (
                    <span className="case-date">
                      <FiCalendar size={14} />
                      <strong>Date:</strong> {selectedCase.date}
                    </span>
                  )}
                </div>
                <div className="meta-row">
                  <span className="case-id">
                    <strong>Case ID:</strong> {selectedCase.id}
                  </span>
                  <span className="case-source">
                    <strong>Source:</strong> Indian Kanoon Database
                  </span>
                </div>
              </div>

              {selectedCase.content && (
                <div className="case-content-full">
                  <h6>Case Summary & Details:</h6>
                  <div className="case-content-text">
                    {selectedCase.content.length > 1000 ? (
                      <>
                        <p>{selectedCase.content.substring(0, 1000)}...</p>
                        <details>
                          <summary>Read Full Case Content</summary>
                          <p>{selectedCase.content}</p>
                        </details>
                      </>
                    ) : (
                      <p>{selectedCase.content}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="case-additional-info">
                <h6>Legal Information:</h6>
                <ul>
                  <li>This case is sourced from the Indian Kanoon database</li>
                  <li>The information provided is for reference purposes only</li>
                  <li>For legal advice, please consult qualified legal professionals</li>
                  <li>Case details may vary based on jurisdiction and updates</li>
                </ul>
              </div>

              <div className="case-actions">
                <button onClick={handleUseCase} className="use-case-btn">
                  Use This Case in Chat
                </button>
                {selectedCase.url && (
                  <a
                    href={selectedCase.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-original-btn"
                  >
                    <FiExternalLink size={16} />
                    View Full Case on Indian Kanoon
                  </a>
                )}
              </div>
              
              <SimilarCases 
                caseId={selectedCase.id} 
                onCaseSelect={(similarCase) => {
                  setSelectedCase(similarCase);
                  handleCaseClick(similarCase.id);
                }}
              />
            </div>
          </div>
        )}

        {!isLoading && cases.length === 0 && query && (
          <div className="no-results">
            <p>No cases found for "{query}". Try different keywords or be more specific.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseSearch;
