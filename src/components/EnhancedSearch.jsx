import React, { useState } from 'react';
import ragService from '../services/ragService';
import './EnhancedSearch.css';

const EnhancedSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState('enhanced'); // enhanced, cases, documents

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            let data;
            switch (searchType) {
                case 'enhanced':
                    data = await ragService.queryWithReferences(query);
                    break;
                case 'cases':
                    data = await ragService.getCaseReferences(query);
                    break;
                case 'documents':
                    data = await ragService.searchDocuments(query);
                    break;
                default:
                    data = await ragService.queryWithReferences(query);
            }
            setResults(data);
        } catch (error) {
            console.error('Search error:', error);
            setResults({ error: 'Failed to perform search. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const renderEnhancedResults = (data) => (
        <div className="enhanced-results">
            <div className="summary-section">
                <h3>AI Summary</h3>
                <div className="summary-content" dangerouslySetInnerHTML={{ __html: data.summary?.replace(/\n/g, '<br/>') }} />
            </div>

            {data.caseReferences && data.caseReferences.length > 0 && (
                <div className="cases-section">
                    <h3>Case References ({data.totalCases} found)</h3>
                    {data.caseReferences.map((caseRef, index) => (
                        <div key={index} className="case-card">
                            <h4>{caseRef.title || 'Untitled Case'}</h4>
                            <div className="case-details">
                                <p><strong>Court:</strong> {caseRef.court || 'Unknown'}</p>
                                <p><strong>Date:</strong> {caseRef.date || 'Unknown'}</p>
                                {caseRef.citation && <p><strong>Citation:</strong> {caseRef.citation}</p>}
                                {caseRef.snippet && (
                                    <p><strong>Summary:</strong> {caseRef.snippet.substring(0, 200)}...</p>
                                )}
                                {caseRef.url && (
                                    <a href={caseRef.url} target="_blank" rel="noopener noreferrer">
                                        View Full Case
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {data.localDocuments && data.localDocuments.length > 0 && (
                <div className="documents-section">
                    <h3>Relevant Documents</h3>
                    {data.localDocuments.map((doc, index) => (
                        <div key={index} className="document-card">
                            <p><strong>Source:</strong> {doc.source}</p>
                            <p>{doc.content.substring(0, 300)}...</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderCaseResults = (data) => (
        <div className="cases-results">
            <h3>Case References ({data.total} found)</h3>
            {data.cases.map((caseRef, index) => (
                <div key={index} className="case-card">
                    <h4>{caseRef.title || 'Untitled Case'}</h4>
                    <div className="case-details">
                        <p><strong>Court:</strong> {caseRef.court || 'Unknown'}</p>
                        <p><strong>Date:</strong> {caseRef.date || 'Unknown'}</p>
                        {caseRef.citation && <p><strong>Citation:</strong> {caseRef.citation}</p>}
                        {caseRef.snippet && (
                            <p><strong>Summary:</strong> {caseRef.snippet.substring(0, 200)}...</p>
                        )}
                        {caseRef.url && (
                            <a href={caseRef.url} target="_blank" rel="noopener noreferrer">
                                View Full Case
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderDocumentResults = (data) => (
        <div className="documents-results">
            <h3>Document Search Results</h3>
            {data.map((doc, index) => (
                <div key={index} className="document-card">
                    <p><strong>Source:</strong> {doc.source}</p>
                    <p><strong>Document ID:</strong> {doc.docId}</p>
                    <p>{doc.content.substring(0, 300)}...</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="enhanced-search">
            <div className="search-header">
                <h2>Enhanced Legal Search</h2>
                <p>Search with AI-powered summaries and case references</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
                <div className="search-type-selector">
                    <label>
                        <input
                            type="radio"
                            value="enhanced"
                            checked={searchType === 'enhanced'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        Enhanced Search (AI + Cases + Documents)
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="cases"
                            checked={searchType === 'cases'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        Case References Only
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="documents"
                            checked={searchType === 'documents'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        Local Documents Only
                    </label>
                </div>

                <div className="search-input-group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter your legal query (e.g., 'IPC 302 murder cases', 'Article 21 right to life')"
                        className="search-input"
                    />
                    <button type="submit" disabled={loading} className="search-button">
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {results && (
                <div className="search-results">
                    {results.error ? (
                        <div className="error-message">{results.error}</div>
                    ) : (
                        <>
                            {searchType === 'enhanced' && renderEnhancedResults(results)}
                            {searchType === 'cases' && renderCaseResults(results)}
                            {searchType === 'documents' && renderDocumentResults(results)}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default EnhancedSearch;