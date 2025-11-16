import apiClient from '../utils/axiosConfig';
import { API_CONFIG } from '../config/api';

class CaseService {
  async searchCases(query) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CASES.SEARCH, {
      params: { query }
    });
    return response.data;
  }

  async getCaseDetails(caseId) {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CASES.GET_DETAILS}/${caseId}`);
    return response.data;
  }

  async getContextualResponse(query) {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CASES.CONTEXTUAL, {
      params: { query }
    });
    return response.data;
  }

  async getLocalCases(keyword = null) {
    const params = keyword ? { keyword } : {};
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CASES.LOCAL, { params });
    return response.data;
  }

  async getSimilarCases(caseId, page = 0, size = 5) {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CASES.SIMILAR}/${caseId}`, {
      params: { page, size }
    });
    return response.data;
  }
}

export default new CaseService();
