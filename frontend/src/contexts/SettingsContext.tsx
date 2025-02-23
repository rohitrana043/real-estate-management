// src/contexts/SettingsContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { useSnackbar } from 'notistack';
import { settingsStorage } from '@/utils/storage';

type ThemeMode = 'light' | 'dark';
type Language = 'en' | 'fr';

interface AppSettings {
  theme: ThemeMode;
  language: Language;
}

interface SettingsContextType {
  themeMode: ThemeMode;
  language: Language;
  toggleTheme: () => void;
  changeLanguage: (lang: Language) => void;
  resetToDefaultSettings: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'en',
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Use useMemo to ensure consistent initial state across server and client
  const initialSettings = useMemo(() => {
    // Only attempt to load from localStorage in the browser
    if (typeof window !== 'undefined') {
      return settingsStorage.load(DEFAULT_SETTINGS);
    }
    return DEFAULT_SETTINGS;
  }, []);

  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [isClient, setIsClient] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Ensure we only run client-side effects after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle initialization effects
  useEffect(() => {
    // Only run on client and if not already fetched
    if (!isClient) return;

    const initializeSettings = async () => {
      let initialSettings = { ...settings };
      let shouldUpdateSettings = false;

      // Check system preferences for theme if not already set
      if (!settingsStorage.exists()) {
        // Apply system theme preference if no saved setting
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          initialSettings.theme = 'dark';
          shouldUpdateSettings = true;
        }

        // Apply browser language preference if no saved setting
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('fr')) {
          initialSettings.language = 'fr';
          shouldUpdateSettings = true;
        }
      }

      // Update settings if needed
      if (shouldUpdateSettings) {
        setSettings(initialSettings);
      }
    };

    initializeSettings();

    // Add event listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      // Only auto-apply system theme if user hasn't explicitly set a preference
      if (!settingsStorage.exists()) {
        setSettings((prev) => ({
          ...prev,
          theme: e.matches ? 'dark' : 'light',
        }));
      }
    };

    // Add listener for theme changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleThemeChange);
    }

    return () => {
      // Clean up listener
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleThemeChange);
      }
    };
  }, [isClient]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      settingsStorage.save(settings);
    }
  }, [settings, isClient]);

  const toggleTheme = () => {
    setSettings((prev) => {
      const newTheme = prev.theme === 'light' ? 'dark' : 'light';

      enqueueSnackbar(`Switched to ${newTheme} mode`, {
        variant: 'info',
      });

      return {
        ...prev,
        theme: newTheme,
      };
    });
  };

  const changeLanguage = (lang: Language) => {
    setSettings((prev) => {
      enqueueSnackbar(
        `Language changed to ${lang === 'en' ? 'English' : 'French'}`,
        { variant: 'info' }
      );

      return {
        ...prev,
        language: lang,
      };
    });
  };

  const resetToDefaultSettings = async () => {
    try {
      // Reset local app settings
      setSettings(DEFAULT_SETTINGS);

      // Save to localStorage
      settingsStorage.save(DEFAULT_SETTINGS);

      // Skip API call if not logged in
      if (typeof window === 'undefined' || !localStorage.getItem('token')) {
        enqueueSnackbar('Reset to default settings', { variant: 'info' });
        return;
      }

      enqueueSnackbar('Reset to default settings', {
        variant: 'info',
      });
    } catch (error) {
      enqueueSnackbar('Failed to reset settings', {
        variant: 'error',
      });
    }
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return null;
  }

  return (
    <SettingsContext.Provider
      value={{
        themeMode: settings.theme,
        language: settings.language,
        toggleTheme,
        changeLanguage,
        resetToDefaultSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
