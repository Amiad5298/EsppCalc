import axios from 'axios';

export const fetchStockPrice = async (symbol, apiKey) => {
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
        return response.data.c;
    } catch (error) {
        console.error('Error fetching stock price:', error);
        return null;
    }
};

export const validateStockSymbol = async (symbol, apiKey) => {
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/search?q=${symbol}&token=${apiKey}`);
        if (response.data.result.length === 0) {
            return `סימול מניה '${symbol}' לא נמצא.`;
        }
        return '';
    } catch (error) {
        console.error('Error validating stock symbol:', error);
        return `סימול מניה '${symbol}' לא נמצא`;
    }
};

export const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatPercentage = (number) => {
    return number + "%";
};
