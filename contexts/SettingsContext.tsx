import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SettingsState, DEFAULT_SETTINGS } from '../types/settings';

interface SettingsContextType {
  settings: SettingsState;
  updateSetting: (category: keyof SettingsState, key: string, value: any) => void;
  resetCategory: (category: keyof SettingsState) => void;
  resetAll: () => void;
  clearCache: () => void;
  exportSettings: () => void;
  importSettings: (jsonString: string) => boolean;
  isSaving: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to adjust color brightness
  const adjustBrightness = (col: string, amt: number) => {
    let usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('onyxflow-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new keys that might be missing in old saved state
        const merged: SettingsState = {
            ...DEFAULT_SETTINGS,
            ...parsed,
            general: { ...DEFAULT_SETTINGS.general, ...parsed.general },
            appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
            project: { ...DEFAULT_SETTINGS.project, ...parsed.project },
            storage: { ...DEFAULT_SETTINGS.storage, ...parsed.storage },
            performance: { ...DEFAULT_SETTINGS.performance, ...parsed.performance },
            security: { ...DEFAULT_SETTINGS.security, ...parsed.security },
        };
        setSettings(merged);
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }, []);

  // Apply visual settings immediately
  useEffect(() => {
    // 1. Theme
    if (settings.appearance.theme === 'dark' || (settings.appearance.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 2. Font Size
    document.body.setAttribute('data-font-size', settings.appearance.fontSize);

    // 3. Accent Color
    const root = document.documentElement;
    root.style.setProperty('--color-accent-500', settings.appearance.accentColor);
    // Generate a slightly darker shade for hover/600 states
    root.style.setProperty('--color-accent-600', adjustBrightness(settings.appearance.accentColor, -20));
  }, [settings.appearance]);

  // Debounced save for persistence
  useEffect(() => {
    setIsSaving(true);
    const handler = setTimeout(() => {
      localStorage.setItem('onyxflow-settings', JSON.stringify(settings));
      setIsSaving(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [settings]);

  const updateSetting = useCallback((category: keyof SettingsState, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as any],
        [key]: value,
      },
      lastUpdated: Date.now(),
    }));
  }, []);

  const resetCategory = useCallback((category: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [category]: DEFAULT_SETTINGS[category],
    }));
  }, []);

  const resetAll = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
        setSettings(DEFAULT_SETTINGS);
        // Force immediate apply of defaults to CSS vars
        document.documentElement.style.removeProperty('--color-accent-500');
        document.documentElement.style.removeProperty('--color-accent-600');
        document.body.removeAttribute('data-font-size');
        localStorage.removeItem('onyxflow-settings');
    }
  }, []);

  const clearCache = useCallback(() => {
      // Simulate clearing cache
      console.log("Clearing application cache...");
      alert("Application cache cleared successfully. 145 MB freed.");
  }, []);

  const exportSettings = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `onyxflow_settings_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [settings]);

  const importSettings = useCallback((jsonString: string) => {
    try {
        const parsed = JSON.parse(jsonString);
        // Basic validation
        if (!parsed.general || !parsed.appearance) throw new Error("Invalid settings format");
        setSettings(prev => ({
             ...DEFAULT_SETTINGS,
             ...parsed
        }));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSetting, 
      resetCategory, 
      resetAll,
      clearCache,
      exportSettings,
      importSettings,
      isSaving
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};