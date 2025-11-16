import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import SimilarCases from './SimilarCases';
import caseService from '../services/caseService';
import './SimilarCasesPage.css';

const SimilarCasesPage = () => {
  const [caseId, setCaseId] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!caseId.trim()) return;

    setIsLoading(true);
    setError(null);
    setSelectedCase(null);

    try {
      const caseDetails = await caseService.getCaseDetails(caseId.trim());
      setSelectedCase(caseDetails);
    } catch (err) {
      setError('Case not found. Please check the case ID and try again.');
      console.error('Error fetching case:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimilarCaseSelect = async (similarCase) => {
    try {
      const caseDetails = await caseService.getCaseDetails(similarCase.id);
      setSelectedCase(caseDetails);
      setCaseId(similarCase.id);
    } catch (err) {
      setError('Failed to load selected case details.');
      console.error('Error fetching similar case details:', err);
    }
  };

  return (
    <div className="similar-cases-page">
      <div className="page-header">
        <h2>Find Similar Cases</h2>
        <p>Enter a case ID to find similar legal cases with pagination support</p>
      </div>

      <form onSubmit={handleSearch} className="case-search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            placeholder="Enter case ID (e.g., 123456)"
            className="case-id-input"
          />
          <button type="submit" disabled={isLoading} className="search-btn">
            <FiSearch size={20} />
            {isLoading ? 'Searching...' : 'Find Similar'}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {selectedCase && (
        <div className="selected-case-info">
          <h3>Selected Case</h3>
          <div className="case-summary">
            <h4>{selectedCase.title}</h4>
            <div className="case-meta">
              <span className="case-court">{selectedCase.court}</span>
              {selectedCase.date && <span className="case-date">{selectedCase.date}</span>}
            </div>
            <p className="case-id">Case ID: {selectedCase.id}</p>
          </div>
        </div>
      )}

      <SimilarCases 
        caseId={selectedCase?.id} 
        onCaseSelect={handleSimilarCaseSelect}
      />
    </div>
  );
};

export default SimilarCasesPage;