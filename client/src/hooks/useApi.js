import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * useApi — generic hook for making API requests with loading/error state.
 *
 * Keeps components clean by centralising fetch logic.
 * Will be extended during the Auth phase with token handling.
 *
 * Usage:
 *   const { data, loading, error, request } = useApi();
 *   useEffect(() => { request(() => api.get('/health')); }, []);
 */
const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, request };
};

export default useApi;
