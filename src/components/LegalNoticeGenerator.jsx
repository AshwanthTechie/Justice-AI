import React, { useState } from 'react';
import { FiFileText, FiX, FiDownload } from 'react-icons/fi';

const LegalNoticeGenerator = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    clientName: '',
    respondentName: '',
    respondentAddress: ''
  });
  const [generatedNotice, setGeneratedNotice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const issueTypes = [
    'Defective Product', 'Non-Refund', 'Service Deficiency', 
    'Salary Non-Payment', 'Property Dispute', 'Contract Breach'
  ];

  const generateNotice = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `Generate a professional legal notice based on the following details. Choose the most appropriate format (consumer complaint, employment dispute, property matter, etc.) and legal framework for this specific case. Make it formal and legally sound:

Issue Type: ${formData.issueType}
Client Name: ${formData.clientName}
Respondent: ${formData.respondentName}
Respondent Address: ${formData.respondentAddress}
Issue Description: ${formData.description}

Requirements:
- Use proper legal notice format
- Include relevant Indian laws and acts
- Set appropriate timeline for response
- Include consequences for non-compliance
- Add educational disclaimer
- Make it professional and formal`;

      const response = await fetch('http://localhost:7777/api/chat/generate-notice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt })
      });

      if (response.ok) {
        const data = await response.text();
        setGeneratedNotice(data);
      } else {
        throw new Error('Failed to generate notice');
      }
    } catch (error) {
      console.error('Error generating notice:', error);
      setGeneratedNotice('Error generating legal notice. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadNotice = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedNotice], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'legal_notice.txt';
    element.click();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#2c2c2c', borderRadius: '12px', width: '90%',
        maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', color: 'white'
      }}>
        <div style={{
          padding: '20px', borderBottom: '1px solid #444',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiFileText /> Legal Notice Generator
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'white',
            cursor: 'pointer', fontSize: '20px'
          }}>
            <FiX />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          {!generatedNotice ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Issue Type</label>
                <select
                  value={formData.issueType}
                  onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                  style={{
                    width: '100%', padding: '12px', background: '#3a3a3a',
                    border: '1px solid #555', borderRadius: '6px', color: 'white'
                  }}
                >
                  <option value="">Select Issue Type</option>
                  {issueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Your Name</label>
                <input
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  style={{
                    width: '100%', padding: '12px', background: '#3a3a3a',
                    border: '1px solid #555', borderRadius: '6px', color: 'white'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Respondent Name</label>
                <input
                  value={formData.respondentName}
                  onChange={(e) => setFormData({...formData, respondentName: e.target.value})}
                  style={{
                    width: '100%', padding: '12px', background: '#3a3a3a',
                    border: '1px solid #555', borderRadius: '6px', color: 'white'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Respondent Address</label>
                <textarea
                  value={formData.respondentAddress}
                  onChange={(e) => setFormData({...formData, respondentAddress: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%', padding: '12px', background: '#3a3a3a',
                    border: '1px solid #555', borderRadius: '6px', color: 'white', resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Describe Your Issue</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  style={{
                    width: '100%', padding: '12px', background: '#3a3a3a',
                    border: '1px solid #555', borderRadius: '6px', color: 'white', resize: 'vertical'
                  }}
                />
              </div>

              <button
                onClick={generateNotice}
                disabled={!formData.description || !formData.clientName || isGenerating}
                style={{
                  padding: '12px 24px',
                  background: (formData.description && formData.clientName && !isGenerating) ? '#007acc' : '#555',
                  color: 'white', border: 'none', borderRadius: '6px',
                  cursor: (formData.description && formData.clientName && !isGenerating) ? 'pointer' : 'not-allowed'
                }}
              >
                {isGenerating ? '🤖 AI Generating...' : '🤖 Generate with AI'}
              </button>
            </div>
          ) : (
            <div>
              <h4>Generated Legal Notice</h4>
              <div style={{
                background: '#1a1a1a', padding: '20px', borderRadius: '6px',
                marginBottom: '20px', whiteSpace: 'pre-line', fontSize: '14px',
                lineHeight: '1.6', maxHeight: '400px', overflow: 'auto'
              }}>
                {generatedNotice}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setGeneratedNotice('')}
                  style={{
                    padding: '12px 24px', background: '#555', color: 'white',
                    border: 'none', borderRadius: '6px', cursor: 'pointer'
                  }}
                >
                  Generate New
                </button>
                <button
                  onClick={downloadNotice}
                  style={{
                    padding: '12px 24px', background: '#27ae60', color: 'white',
                    border: 'none', borderRadius: '6px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  <FiDownload /> Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalNoticeGenerator;