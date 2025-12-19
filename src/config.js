export const API_BASE_URL = 'https://ml-fraud-check.onrender.com';
export const API_ENDPOINTS = {
  SCORE: `${API_BASE_URL}/score`,
  HEALTH: `${API_BASE_URL}/health`,
};

export const TRANSACTION_TYPES = [
  { value: 'CASH_OUT', label: 'CASH_OUT' },
  { value: 'PAYMENT', label: 'PAYMENT' },
  { value: 'CASH_IN', label: 'CASH_IN' },
  { value: 'TRANSFER', label: 'TRANSFER' },
  { value: 'DEBIT', label: 'DEBIT' }
];
