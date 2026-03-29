
export const apiFetch = async (resource: string | Request, config: RequestInit = {}) => {
  const url = typeof resource === 'string' ? resource : resource.url;
  
  if (url.startsWith('/api/')) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      ...(config.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    config.headers = headers;
  }
  
  return fetch(resource, config);
};
