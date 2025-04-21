import React from 'react';
import './TagCloud.css';

const TagCloud = ({ data, onTermSelect }) => {
  // Define color mapping for GO categories
  const categoryColors = {
    'biological_process': '#4285F4', // Blue
    'molecular_function': '#EA4335', // Red
    'cellular_component': '#34A853'  // Green
  };

  // Sort data by weight to ensure larger terms are rendered first (in the center)
  const sortedData = [...data].sort((a, b) => b.weight - a.weight);
  
  // Calculate the minimum and maximum font sizes based on the data range
  const minSize = Math.min(...data.map(item => item.weight));
  const maxSize = Math.max(...data.map(item => item.weight));
  
  // Function to calculate font size based on weight
  const calculateFontSize = (weight) => {
    if (data.length <= 1) return 150; // Default size if only one term
    
    const minFontSize = 80;
    const maxFontSize = 250;
    const fontRange = maxFontSize - minFontSize;
    const dataRange = maxSize - minSize;
    
    // Avoid division by zero
    if (dataRange === 0) return (minFontSize + maxFontSize) / 2;
    
    return minFontSize + ((weight - minSize) / dataRange) * fontRange;
  };
  
  // Function to generate random position within the cloud
  const getRandomPosition = (index, total) => {
    // Create a spiral-like arrangement
    const angle = index * 0.5;
    const radius = 30 + (index * 2);
    const x = 50 + (radius * Math.cos(angle)) * 0.5;
    const y = 50 + (radius * Math.sin(angle)) * 0.5;
    
    return {
      left: `${Math.min(Math.max(x, 5), 95)}%`,
      top: `${Math.min(Math.max(y, 5), 95)}%`,
    };
  };

  return (
    <div className="tag-cloud-container">
      <h3>GO Term Tag Cloud</h3>
      <p>Click on a term to see associated genes. Size represents enrichment level.</p>
      
      {data.length === 0 ? (
        <div className="no-terms">No GO terms found with current filters</div>
      ) : (
        <div className="tag-cloud">
          {sortedData.map((term, index) => (
            <div
              key={term.go_id}
              className="tag-term"
              style={{
                ...getRandomPosition(index, sortedData.length),
                fontSize: `${calculateFontSize(term.weight)}%`,
                color: categoryColors[term.category] || '#000',
                zIndex: Math.floor(term.weight),
                position: 'absolute',
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                cursor: 'pointer',
                transition: 'transform 0.3s ease, font-size 0.3s ease'
              }}
              onClick={() => onTermSelect(term)}
              title={`${term.text} (${term.go_id}) - Enrichment: ${term.weight.toFixed(1)}%`}
            >
              {term.text}
            </div>
          ))}
        </div>
      )}
      
      <div className="legend">
        <div className="legend-item">
          <span className="color-box" style={{ backgroundColor: categoryColors.biological_process }}></span>
          <span>Biological Process</span>
        </div>
        <div className="legend-item">
          <span className="color-box" style={{ backgroundColor: categoryColors.molecular_function }}></span>
          <span>Molecular Function</span>
        </div>
        <div className="legend-item">
          <span className="color-box" style={{ backgroundColor: categoryColors.cellular_component }}></span>
          <span>Cellular Component</span>
        </div>
      </div>
    </div>
  );
};

export default TagCloud;
