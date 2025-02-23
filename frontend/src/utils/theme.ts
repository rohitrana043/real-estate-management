// src/utils/theme.ts
import { settingsStorage } from './storage';

type ThemeMode = 'light' | 'dark';

interface ThemeSettings {
  theme: ThemeMode;
}

/**
 * Get the current theme from localStorage, or system preference
 * @returns The current theme ('light' or 'dark')
 */
export const getCurrentTheme = (): ThemeMode => {
  // If running on server, default to light
  if (typeof window === 'undefined') return 'light';

  // Check localStorage first
  const savedSettings = settingsStorage.load<Partial<ThemeSettings>>({});
  if (savedSettings.theme) return savedSettings.theme;

  // Fall back to system preference
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  // Default to light
  return 'light';
};

/**
 * Apply theme to document
 * @param theme The theme to apply
 */
export const applyTheme = (theme: ThemeMode): void => {
  if (typeof window === 'undefined') return;

  const root = window.document.documentElement;

  // Remove both classes
  root.classList.remove('light-theme', 'dark-theme');

  // Add the appropriate class
  root.classList.add(`${theme}-theme`);

  // Set the color-scheme property
  root.style.colorScheme = theme;

  // For MUI and other frameworks that use data-* attributes
  root.setAttribute('data-theme', theme);

  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      theme === 'dark' ? '#121212' : '#ffffff'
    );
  }
};

/**
 * Setup initial theme and listeners
 */
export const initializeTheme = (): void => {
  if (typeof window === 'undefined') return;

  // Apply current theme
  const currentTheme = getCurrentTheme();
  applyTheme(currentTheme);

  // Set up listener for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    // Only auto-apply system theme if user hasn't explicitly set a preference
    const savedSettings = settingsStorage.load<Partial<ThemeSettings>>({});
    if (!savedSettings.theme) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  };

  // Add listener for theme changes
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemThemeChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleSystemThemeChange as any);
  }
};

/**
 * Toggle between light and dark themes
 * @returns The new theme after toggling
 */
export const toggleTheme = (): ThemeMode => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  // Save to localStorage
  const savedSettings = settingsStorage.load<Partial<ThemeSettings>>({});
  settingsStorage.save({
    ...savedSettings,
    theme: newTheme,
  });

  // Apply the new theme
  applyTheme(newTheme);

  return newTheme;
};
