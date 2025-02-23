// src/utils/storage.ts

/**
 * Save data to localStorage with error handling
 * @param key The key to store the data under
 * @param data The data to store
 * @returns true if saved successfully, false otherwise
 */
export const saveToStorage = <T>(key: string, data: T): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage [${key}]:`, error);
    return false;
  }
};

/**
 * Load data from localStorage with error handling
 * @param key The key to retrieve
 * @param defaultValue The default value to return if not found or error
 * @returns The stored data or defaultValue if not found
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return defaultValue;

    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`Error loading from localStorage [${key}]:`, error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage with error handling
 * @param key The key to remove
 * @returns true if removed successfully, false otherwise
 */
export const removeFromStorage = (key: string): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage [${key}]:`, error);
    return false;
  }
};

/**
 * Check if a key exists in localStorage
 * @param key The key to check
 * @returns true if the key exists, false otherwise
 */
export const existsInStorage = (key: string): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage [${key}]:`, error);
    return false;
  }
};

/**
 * Create a storage object for a specific domain with type safety
 * @param keyPrefix Prefix for all keys in this domain
 * @returns An object with typed methods for this storage domain
 */
export const createStorageDomain = <T>(keyPrefix: string) => {
  return {
    save: (key: string, data: T) => saveToStorage(`${keyPrefix}.${key}`, data),
    load: (key: string, defaultValue: T) =>
      loadFromStorage(`${keyPrefix}.${key}`, defaultValue),
    remove: (key: string) => removeFromStorage(`${keyPrefix}.${key}`),
    exists: (key: string) => existsInStorage(`${keyPrefix}.${key}`),
  };
};

// Pre-configured storage domains
export const appStorage = createStorageDomain('app');
export const userStorage = createStorageDomain('user');
export const settingsStorage = {
  save: <T>(data: T) => saveToStorage('appSettings', data),
  load: <T>(defaultValue: T) => loadFromStorage('appSettings', defaultValue),
  remove: () => removeFromStorage('appSettings'),
  exists: () => existsInStorage('appSettings'),
};
