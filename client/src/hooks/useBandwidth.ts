import { useState, useEffect } from 'react';
import { api, GlobalBandwidthSettings } from '../utils/api';

export const useBandwidth = () => {
  const [globalSettings, setGlobalSettings] = useState<GlobalBandwidthSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGlobalBandwidth();
      setGlobalSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bandwidth settings');
    } finally {
      setLoading(false);
    }
  };

  const setGlobal = async (enabled: boolean, maxSpeed: number) => {
    setError(null);
    try {
      await api.setGlobalBandwidth(enabled, maxSpeed);
      await fetchGlobalSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set global bandwidth');
      throw err;
    }
  };

  const setDevice = async (deviceId: string, enabled: boolean, maxSpeed: number) => {
    setError(null);
    try {
      await api.setDeviceBandwidth(deviceId, enabled, maxSpeed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set device bandwidth');
      throw err;
    }
  };

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  return {
    globalSettings,
    loading,
    error,
    setGlobal,
    setDevice,
    refetch: fetchGlobalSettings,
  };
};
