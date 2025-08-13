import React, { useState } from 'react';
import { X, Building2, UserCheck, CreditCard, MapPin, Hash, Check } from 'lucide-react';

const BankDetailsModal = ({ isOpen, onClose, onSubmit, ownerData }) => {
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountType: '',
    accountNumber: '',
    confirmAccountNumber: '',
    bankName: '',
    branchName: '',
    branchCode: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const sriLankanBanks = [
    'Bank of Ceylon',
    'People\'s Bank',
    'Commercial Bank of Ceylon',
    'Hatton National Bank',
    'Sampath Bank',
    'Nations Trust Bank',
    'DFCC Bank',
    'Union Bank',
    'Pan Asia Banking Corporation',
    'Seylan Bank',
    'National Development Bank',
    'Other'
  ];

  const accountTypes = [
    { value: 'savings', label: 'Savings Account' },
    { value: 'current', label: 'Current Account' },
    { value: 'business', label: 'Business Account' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!bankData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (!bankData.accountType) {
      newErrors.accountType = 'Account type is required';
    }

    if (!bankData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (bankData.accountNumber.length < 8) {
      newErrors.accountNumber = 'Account number should be at least 8 digits';
    }

    if (!bankData.confirmAccountNumber.trim()) {
      newErrors.confirmAccountNumber = 'Please confirm your account number';
    } else if (bankData.accountNumber !== bankData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }

    if (!bankData.bankName) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!bankData.branchName.trim()) {
      newErrors.branchName = 'Branch name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Prepare data for submission
      const submitData = {
        ...bankData,
        owner_id: ownerData?.id || ownerData?.owner_id
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting bank details:', error);
      alert('Failed to save bank details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBankData({
      accountHolderName: '',
      accountType: '',
      accountNumber: '',
      confirmAccountNumber: '',
      bankName: '',
      branchName: '',
      branchCode: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="w-6 h-6" />
              <div>
                <h2 className="text-2xl font-bold">Bank Account Details</h2>
                <p className="text-blue-100">Secure payment processing setup</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Owner Info Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="font-medium">Name:</span> {ownerData?.name || 'N/A'}</div>
              <div><span className="font-medium">Email:</span> {ownerData?.email || 'N/A'}</div>
              <div><span className="font-medium">Contact:</span> {ownerData?.contact || 'N/A'}</div>
              <div><span className="font-medium">NIC:</span> {ownerData?.nic || 'N/A'}</div>
            </div>
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserCheck className="mr-2 w-4 h-4 text-blue-600" />
              Account Holder Name *
            </label>
            <input
              type="text"
              name="accountHolderName"
              value={bankData.accountHolderName}
              onChange={handleChange}
              placeholder="Full name as per bank records"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.accountHolderName ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.accountHolderName && (
              <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>
            )}
          </div>

          {/* Account Type */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="mr-2 w-4 h-4 text-blue-600" />
              Account Type *
            </label>
            <select
              name="accountType"
              value={bankData.accountType}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.accountType ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select account type</option>
              {accountTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.accountType && (
              <p className="text-red-500 text-sm mt-1">{errors.accountType}</p>
            )}
          </div>

          {/* Bank Name */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Building2 className="mr-2 w-4 h-4 text-blue-600" />
              Bank Name *
            </label>
            <select
              name="bankName"
              value={bankData.bankName}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.bankName ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select your bank</option>
              {sriLankanBanks.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
            {errors.bankName && (
              <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
            )}
          </div>

          {/* Branch Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="mr-2 w-4 h-4 text-blue-600" />
                Branch Name *
              </label>
              <input
                type="text"
                name="branchName"
                value={bankData.branchName}
                onChange={handleChange}
                placeholder="e.g., Colombo Main Branch"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.branchName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.branchName && (
                <p className="text-red-500 text-sm mt-1">{errors.branchName}</p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Hash className="mr-2 w-4 h-4 text-blue-600" />
                Branch Code (Optional)
              </label>
              <input
                type="text"
                name="branchCode"
                value={bankData.branchCode}
                onChange={handleChange}
                placeholder="e.g., 001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="mr-2 w-4 h-4 text-blue-600" />
              Bank Account Number *
            </label>
            <input
              type="text"
              name="accountNumber"
              value={bankData.accountNumber}
              onChange={handleChange}
              placeholder="Enter your account number"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.accountNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
            )}
          </div>

          {/* Confirm Account Number */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Check className="mr-2 w-4 h-4 text-green-600" />
              Confirm Account Number *
            </label>
            <input
              type="text"
              name="confirmAccountNumber"
              value={bankData.confirmAccountNumber}
              onChange={handleChange}
              placeholder="Re-enter your account number"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.confirmAccountNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.confirmAccountNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmAccountNumber}</p>
            )}
            {bankData.accountNumber && bankData.confirmAccountNumber && 
             bankData.accountNumber === bankData.confirmAccountNumber && (
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <Check className="mr-1 w-4 h-4" /> Account numbers match
              </p>
            )}
          </div>

          {/* Security Note */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Building2 className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Security Notice:</strong> Your bank details are encrypted and stored securely. 
                  They will only be used for processing payments related to your property listings.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Bank Details'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;