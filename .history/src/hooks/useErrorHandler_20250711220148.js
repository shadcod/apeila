// src/hooks/useErrorHandler.js
import { useState } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsync = async (asyncFunction, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      showSuccessMessage = true, 
      successMessage = 'Operation completed successfully' 
    } = options;

    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      
      if (showSuccessMessage) {
        // يمكن استخدام toast library هنا
        console.log(successMessage);
      }
      
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      } else {
        // Default error handling
        console.error('Error:', err);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    error,
    isLoading,
    handleAsync,
    clearError,
  };
};