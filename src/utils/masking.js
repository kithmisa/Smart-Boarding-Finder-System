/**
 * Mask sensitive data for display (e.g., XXXX5678)
 * @param {string} text - Text to mask
 * @param {number} visibleChars - Number of characters to show at the end
 * @returns {string} - Masked text
 */
export const maskData = (text, visibleChars = 4) => {
  if (!text) return '';
  if (text.length <= visibleChars) return text;
  
  const visiblePart = text.slice(-visibleChars);
  const maskedPart = 'X'.repeat(text.length - visibleChars);
  return maskedPart + visiblePart;
};

/**
 * Mask account number specifically (e.g., XXXX5678)
 * @param {string} accountNumber - Account number to mask
 * @returns {string} - Masked account number
 */
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  if (accountNumber.length <= 4) return accountNumber;
  
  const visiblePart = accountNumber.slice(-4);
  const maskedPart = 'X'.repeat(accountNumber.length - 4);
  return maskedPart + visiblePart;
};
