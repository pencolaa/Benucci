import { createContext, useContext, useMemo, useState } from 'react';

const PreferencesContext = createContext(null);

const themePalettes = {
  light: {
    mode: 'light',
    outerBackground: '#212121',
    panelBackground: '#f4f4f4',
    panelAltBackground: '#cddbe4',
    surface: '#f5f6f7',
    mutedSurface: '#e8eef2',
    inputBackground: '#e7e7eb',
    cardBackground: '#d7e4ec',
    textPrimary: '#1b1b1b',
    textSecondary: '#5f6a75',
    textMuted: '#8b97a2',
    accent: '#12b6df',
    accentStrong: '#147bcc',
    accentSoft: '#e4f6fb',
    accentBorder: '#c2e5ef',
    border: '#d2d8de',
    successSurface: '#def6e7',
    successText: '#2f8f5e',
    dangerText: '#c13e54',
    navBackground: '#f7f7f7',
    navActive: '#d9dce1',
    white: '#ffffff',
    black: '#000000',
  },
  dark: {
    mode: 'dark',
    outerBackground: '#111315',
    panelBackground: '#1c2126',
    panelAltBackground: '#24313b',
    surface: '#28333c',
    mutedSurface: '#313c46',
    inputBackground: '#2a333b',
    cardBackground: '#32414d',
    textPrimary: '#f4f7f8',
    textSecondary: '#c7d0d7',
    textMuted: '#95a4af',
    accent: '#5ecde8',
    accentStrong: '#2b9fd1',
    accentSoft: '#1f414c',
    accentBorder: '#335968',
    border: '#41515d',
    successSurface: '#214034',
    successText: '#9addb7',
    dangerText: '#ff8da0',
    navBackground: '#20262c',
    navActive: '#2f3943',
    white: '#ffffff',
    black: '#000000',
  },
};

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState({
    themeMode: 'light',
    soundEnabled: true,
    biometricEnabled: false,
    orderUpdates: true,
    offersEnabled: true,
    restockEnabled: false,
  });

  const setThemeMode = (themeMode) => {
    setPreferences((current) => ({ ...current, themeMode }));
  };

  const updatePreference = (key, value) => {
    setPreferences((current) => ({ ...current, [key]: value }));
  };

  const value = useMemo(
    () => ({
      ...preferences,
      setThemeMode,
      updatePreference,
      theme: themePalettes[preferences.themeMode] || themePalettes.light,
    }),
    [preferences]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);

  if (!value) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }

  return value;
}
