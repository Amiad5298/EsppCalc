import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Explanation.css';

const Explanation = ({ title, initialText }) => {
  const [explanationText, setExplanationText] = useState(initialText);

  useEffect(() => {
    axios.get('/texts.json').then(response => {
      setExplanationText(response.data.explanationText);
    });
  }, []);

  return (
    <div className="explanation">
      <h1>{title}</h1>
      <p>{explanationText}</p>
    </div>
  );
};

export default Explanation;
