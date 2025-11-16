import React from 'react';
import { FiShoppingCart, FiShield, FiMonitor, FiBriefcase, FiHome } from 'react-icons/fi';

const CategoryCards = ({ onCategorySelect }) => {
  const categories = [
    { name: 'Consumer Complaints', icon: FiShoppingCart, color: '#3498db' },
    { name: 'Criminal Offenses', icon: FiShield, color: '#e74c3c' },
    { name: 'Cyber Crime', icon: FiMonitor, color: '#9b59b6' },
    { name: 'Employment Law', icon: FiBriefcase, color: '#f39c12' },
    { name: 'Property Disputes', icon: FiHome, color: '#27ae60' }
  ];

  return (
    <div style={{ padding: '15px 0' }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#888', fontSize: '12px' }}>Quick Categories</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <div
              key={index}
              onClick={() => onCategorySelect(category.name)}
              style={{
                padding: '10px',
                background: '#3a3a3a',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                transition: 'background-color 0.2s',
                border: `1px solid ${category.color}20`
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4a4a4a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3a3a3a'}
            >
              <Icon size={14} color={category.color} />
              <span style={{ color: 'white' }}>{category.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCards;