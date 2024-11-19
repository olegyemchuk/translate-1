import React, { createContext, useContext, useState, useEffect } from 'react';

type ApiKey = {
  provider: string;
  key: string;
};

type ApiContextType = {
  apiKeys: ApiKey[];
  addApiKey: (provider: string, key: string) => void;
  removeApiKey: (provider: string) => void;
  getApiKey: (provider: string) => string | null;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    const saved = localStorage.getItem('translationApiKeys');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('translationApiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const addApiKey = (provider: string, key: string) => {
    setApiKeys(current => {
      const filtered = current.filter(k => k.provider !== provider);
      return [...filtered, { provider, key }];
    });
  };

  const removeApiKey = (provider: string) => {
    setApiKeys(current => current.filter(k => k.provider !== provider));
  };

  const getApiKey = (provider: string) => {
    const apiKey = apiKeys.find(k => k.provider === provider);
    return apiKey ? apiKey.key : null;
  };

  return (
    <ApiContext.Provider value={{ apiKeys, addApiKey, removeApiKey, getApiKey }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}