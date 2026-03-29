import { useState, useEffect } from 'react';
import { Service } from './servicesData';
import { apiFetch } from './api';

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/api/services');
      if (!response.ok) {
        throw new Error('Hizmetler yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setServices(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, loading, error, refetch: fetchServices };
};
