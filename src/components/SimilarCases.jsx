import React, { useState, useEffect } from 'react';
import caseService from '../services/caseService';
import './SimilarCases.css';

const SimilarCases = ({ caseId, onCaseSelect }) => {
  const [similarCases, setSimilarCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false
  });

  const fetchSimilarCases = async (page = 0) => {
    if (!caseId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await caseService.getSimilarCases(caseId, page, 5);
      setSimilarCases(response.cases || []);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious
      });
    } catch (err) {
      setError('Failed to fetch similar cases');
      console.error('Error fetching similar cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimilarCases(0);
  }, [caseId]);

  const handlePageChange = (newPage) => {
    fetchSimilarCases(newPage);
  };

  const handleCaseClick = (selectedCase) => {
    if (onCaseSelect) {
      onCaseSelect(selectedCase);
    }
  };

  if (!caseId) {
    return <div className="similar-cases-placeholder">Select a case to view similar cases</div>;
  }

  return (
    <div className="similar-cases-container">
      <h3 className="similar-cases-title">Similar Cases</h3>
      
      {loading && <div className="loading">Loading similar cases...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && similarCases.length === 0 && (
        <div className="no-results">No similar cases found</div>
      )}
      
      {!loading && !error && similarCases.length > 0 && (
        <>
          <div className="cases-list">
            {similarCases.map((caseItem, index) => (
              <div 
                key={caseItem.id || index} 
                className="case-item"
                onClick={() => handleCaseClick(caseItem)}
              >
                <h4 className="case-title">{caseItem.title}</h4>
                <div className="case-meta">
                  <span className="case-court">{caseItem.court}</span>
                  {caseItem.date && <span className="case-date">{caseItem.date}</span>}
                </div>
                {caseItem.snippet && (
                  <p className="case-snippet">{caseItem.snippet}</p>
                )}
              </div>
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevious}
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
                ({pagination.totalElements} total)
              </span>
              
              <button 
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SimilarCases;