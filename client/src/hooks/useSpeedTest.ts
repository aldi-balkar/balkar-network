import { useState } from 'react';
import { api, SpeedTestResult } from '../utils/api';

export const useSpeedTest = () => {
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.runSpeedTest();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run speed test');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, runTest };
};
