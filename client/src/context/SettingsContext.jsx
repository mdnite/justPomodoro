import { createContext, useContext, useEffect, useState } from 'react';
import * as settingsService from '../services/settingsService';
import { useAuth } from './AuthContext';

const SettingsContext = createContext(null);

// Provide the authenticated user's settings to descendant components.
export function SettingsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setSettings(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      try {
        const data = await settingsService.getSettings();
        if (!cancelled) setSettings(data);
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Persist a settings update and refresh local state with the server's response.
  async function saveSettings(data) {
    const updated = await settingsService.updateSettings(data);
    setSettings(updated);
    return updated;
  }

  return (
    <SettingsContext.Provider value={{ settings, isLoading, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Hook for consuming the settings context.
export function useSettings() {
  return useContext(SettingsContext);
}
