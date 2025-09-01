const CryptoJS = require('crypto-js');

// Encryption key - in production, this should be stored in environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secret-encryption-key-32-chars-long';

/**
 * Encrypt sensitive data
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted text
 */
const encrypt = (text) => {
  if (!text) return null;
  try {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt encrypted data
 * @param {string} encryptedText - Encrypted text to decrypt
 * @returns {string} - Decrypted text
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Mask sensitive data for display (e.g., XXXX5678)
 * @param {string} text - Text to mask
 * @param {number} visibleChars - Number of characters to show at the end
 * @returns {string} - Masked text
 */
const maskData = (text, visibleChars = 4) => {
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
const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  if (accountNumber.length <= 4) return accountNumber;
  
  // Always show exactly 4 X's followed by last 4 digits
  // For 10-digit number "1234567890", show "XXXX7890"
  // For 8-digit number "12345678", show "XXXX5678"
  const visiblePart = accountNumber.slice(-4);
  return 'XXXX' + visiblePart;
};

module.exports = {
  encrypt,
  decrypt,
  maskData,
  maskAccountNumber
};
