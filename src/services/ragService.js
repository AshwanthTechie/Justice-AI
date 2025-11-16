import api from '../config/api';

class RagService {
    /**
     * Enhanced RAG query with case references and AI summary
     */
    async queryWithReferences(query, k = 5) {
        try {
            const response = await api.get('/api/rag/query', {
                params: { q: query, k }
            });
            return response.data;
        } catch (error) {
            console.error('Error in RAG query:', error);
            throw error;
        }
    }

    /**
     * Get case references from IndianKanoon
     */
    async getCaseReferences(query) {
        try {
            const response = await api.get('/api/rag/cases', {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching case references:', error);
            throw error;
        }
    }

    /**
     * Traditional RAG search (local documents only)
     */
    async searchDocuments(query, k = 5) {
        try {
            const response = await api.get('/api/rag/search', {
                params: { q: query, k }
            });
            return response.data;
        } catch (error) {
            console.error('Error in document search:', error);
            throw error;
        }
    }

    /**
     * Index a document into the RAG system
     */
    async indexDocument(docId, source, chunks) {
        try {
            const response = await api.post('/api/rag/upsert', {
                docId,
                source,
                chunks
            });
            return response.data;
        } catch (error) {
            console.error('Error indexing document:', error);
            throw error;
        }
    }

    /**
     * Index a case document from IndianKanoon
     */
    async indexCase(caseId, caseData) {
        try {
            const response = await api.post('/api/rag/index-case', {
                caseId,
                caseData
            });
            return response.data;
        } catch (error) {
            console.error('Error indexing case:', error);
            throw error;
        }
    }
}

export default new RagService();