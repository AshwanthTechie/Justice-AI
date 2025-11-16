import React, { useState } from 'react';
import apiClient from '../utils/axiosConfig';
import { API_CONFIG } from '../config/api';

const TestConnection = () => {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testServer = async () => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test basic connectivity
      const response = await fetch(`${API_CONFIG.BASE_URL}/user/test`);
      const data = await response.text();
      setTestResult(`✅ Server is running! Status: ${response.status}, Response: ${data}`);
    } catch (error) {
      setTestResult(`❌ Server connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testRegistration = async () => {
    setIsLoading(true);
    setTestResult('Testing registration...');
    
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.USER.ADD, {
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
      setTestResult(`✅ Registration test successful! Status: ${response.status}`);
    } catch (error) {
      setTestResult(`❌ Registration test failed: ${error.response?.status} - ${error.response?.data || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Server Connection Test</h3>
      <button onClick={testServer} disabled={isLoading} style={{ marginRight: '10px' }}>
        Test Basic Connection
      </button>
      <button onClick={testRegistration} disabled={isLoading}>
        Test Registration
      </button>
      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        {testResult}
      </div>
    </div>
  );
};

export default TestConnection;
