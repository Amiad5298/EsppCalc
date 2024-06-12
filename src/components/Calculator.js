import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchStockPrice, validateStockSymbol, formatNumberWithCommas, formatPercentage } from '../utils/api';
import { doUIValidations } from '../utils/validations';
import './Calculator.css';

const Calculator = () => {
  const [apiKey, setApiKey] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [contributionPercentage, setContributionPercentage] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [startDate, setStartDate] = useState('');
  const [soldDate, setSoldDate] = useState('');
  const [result, setResult] = useState('');
  const [warnings, setWarnings] = useState({});
  const [isFieldInvalid, setIsFieldInvalid] = useState({
    stockSymbol: false,
    monthlySalary: false,
    contributionPercentage: false,
    startDate: false,
    soldDate: false
  });

  useEffect(() => {
    axios.get('/apiKey.json').then(response => {
      setApiKey(response.data.apiKey);
    });
  }, []);

  const handleMonthlySalaryInput = (event) => {
    setMonthlySalary(formatNumberWithCommas(event.target.value.replace(/,/g, '')));
  };

  const handleContributionPercentageInput = (event) => {
    setContributionPercentage(formatPercentage(event.target.value.replace('%', '')));
  };

  const handleStockSymbolInput = async (event) => {
    setStockSymbol(event.target.value);
    const warning = await validateStockSymbol(event.target.value, apiKey);
    setWarnings(prev => ({ ...prev, stockSymbol: warning }));
  };

  const clearWarnings = () => {
    setWarnings({});
    setIsFieldInvalid({
      stockSymbol: false,
      monthlySalary: false,
      contributionPercentage: false,
      startDate: false,
      soldDate: false
    });
  };

  const calculateProfit = async () => {
    console.log('Calculating profit...');
    const validations = doUIValidations(stockSymbol, monthlySalary, contributionPercentage, startDate, soldDate);
    
    // Update invalid fields state
    setIsFieldInvalid({
      stockSymbol: !!validations.warnings.stockSymbol,
      monthlySalary: !!validations.warnings.monthlySalary,
      contributionPercentage: !!validations.warnings.contributionPercentage,
      startDate: !!validations.warnings.startDate,
      soldDate: !!validations.warnings.soldDate
    });

    setWarnings(validations.warnings);

    // Clear warnings and invalid fields after 3 seconds
    setTimeout(clearWarnings, 3000);

    if (!validations.isValid) {
      console.log('Validation failed:', validations.warnings);
      return;
    }

    const startPrice = await fetchStockPrice(stockSymbol, apiKey);
    const endPrice = await fetchStockPrice(stockSymbol, apiKey);
    const soldPrice = await fetchStockPrice(stockSymbol, apiKey);

    if (startPrice === null || endPrice === null || soldPrice === null) {
      setResult(`סימול מניה '${stockSymbol}' לא נמצא או שאין נתונים לתאריכים שנבחרו`);
      return;
    }

    const monthlyContribution = monthlySalary * (contributionPercentage / 100);
    const totalContribution = monthlyContribution * 6;
    const stockPurchasePrice = Math.min(startPrice, endPrice) * 0.85;
    const numberOfShares = totalContribution / stockPurchasePrice;
    const profitPerShare = soldPrice - stockPurchasePrice;
    const totalProfit = numberOfShares * profitPerShare;
    const profitAfterTax = totalProfit * (1 - 0.47); // assuming 47% tax
    const monthlyNetProfit = profitAfterTax / 6;

    setResult(`רווח חודשי נטו: ${monthlyNetProfit.toFixed(2)} ש"ח`);
    console.log('Profit calculated:', monthlyNetProfit);
  };

  return (
    <div className="calculator">
      <h2>מחשבון רווחי ESPP</h2>
      <form>
        <label htmlFor="stockSymbol">סימול מניה:</label>
        <input
          type="text"
          value={stockSymbol}
          onChange={handleStockSymbolInput}
          required
          className={isFieldInvalid.stockSymbol ? 'invalid' : ''}
        />
        <span className="warning-message">{warnings.stockSymbol}</span>

        <label htmlFor="monthlySalary">משכורת חודשית (ברוטו בש"ח):</label>
        <input
          type="text"
          value={monthlySalary}
          onChange={handleMonthlySalaryInput}
          required
          className={isFieldInvalid.monthlySalary ? 'invalid' : ''}
        />
        <span className="warning-message">{warnings.monthlySalary}</span>

        <label htmlFor="contributionPercentage">אחוז הפרשה ל-ESPP:</label>
        <input
          type="text"
          value={contributionPercentage}
          onChange={handleContributionPercentageInput}
          required
          className={isFieldInvalid.contributionPercentage ? 'invalid' : ''}
        />
        <span className="warning-message">{warnings.contributionPercentage}</span>

        <label htmlFor="startDate">תאריך התחלה:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className={isFieldInvalid.startDate ? 'invalid' : ''}
        />
        <span className="warning-message">{warnings.startDate}</span>

        <label htmlFor="soldDate">תאריך מכירה:</label>
        <input
          type="date"
          value={soldDate}
          onChange={(e) => setSoldDate(e.target.value)}
          required
          className={isFieldInvalid.soldDate ? 'invalid' : ''}
        />
        <span className="warning-message">{warnings.soldDate}</span>

        <button type="button" onClick={calculateProfit}>חשב רווח</button>
        <p id="result">{result}</p>
      </form>
    </div>
  );
};

export default Calculator;
