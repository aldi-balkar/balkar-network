import { useState, useEffect } from 'react';
import { api, NetworkInfo } from '../utils/api';

export const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworkInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getNetworkInfo();
      setNetworkInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch network info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkInfo();
  }, []);

  return { networkInfo, loading, error, refetch: fetchNetworkInfo };
};
