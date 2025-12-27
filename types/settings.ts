
export interface GeneralSettings {
  projectLocation: string;
  startupBehavior: 'dashboard' | 'lastProject' | 'minimized';
  language: string;
  dateFormat: string;
  currency: string;
  timezone: string;
  autoDetectTimezone: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto' | 'custom';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  sidebarPosition: 'left' | 'right';
  viewDensity: 'compact' | 'comfortable';
  dashboardLayout: 'grid' | 'list' | 'kanban';
  colorCoding: boolean;
}

export interface ProjectSettings {
  defaultStatus: string;
  autoArchive: boolean;
  autoArchiveDays: number;
  defaultType: string;
  namingConvention: string;
  fileVersioning: boolean;
  versioningFormat: string;
  autoProjectIds: boolean;
  idPrefix: string;
  idStart: number;
  idPadding: number;
}

export interface StorageSettings {
  storageLocation: string;
  enableBackups: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  backupLocation: string;
  retentionCount: number;
  cloudProvider: 'none' | 'google' | 'dropbox' | 'onedrive';
  storageWarningThreshold: number;
  autoCleanup: boolean;
  cleanupDays: number;
  compressBackups: boolean;
}

export interface PerformanceSettings {
  cacheSize: number;
  thumbnailGeneration: boolean;
  thumbnailQuality: 'low' | 'medium' | 'high';
  syncFrequency: 'realtime' | '5s' | '30s' | '1m' | 'manual';
  recentProjectsCount: number;
  searchIndexing: boolean;
}

export interface SecuritySettings {
  passwordProtection: boolean;
  autoLock: boolean;
  autoLockMinutes: number;
  dataEncryption: boolean;
  activityLogging: boolean;
  analyticsOptIn: boolean;
}

export interface SettingsState {
  general: GeneralSettings;
  appearance: AppearanceSettings;
  project: ProjectSettings;
  storage: StorageSettings;
  performance: PerformanceSettings;
  security: SecuritySettings;
  lastUpdated: number;
}

export const DEFAULT_SETTINGS: SettingsState = {
  general: {
    projectLocation: 'D:/Creative/Projects',
    startupBehavior: 'dashboard',
    language: 'en',
    dateFormat: 'yyyy-MM-dd',
    currency: 'USD',
    timezone: 'UTC',
    autoDetectTimezone: true,
  },
  appearance: {
    theme: 'dark',
    accentColor: '#4f46e5',
    fontSize: 'medium',
    sidebarPosition: 'left',
    viewDensity: 'comfortable',
    dashboardLayout: 'grid',
    colorCoding: true,
  },
  project: {
    defaultStatus: 'Not Started',
    autoArchive: false,
    autoArchiveDays: 30,
    defaultType: 'Brand Identity',
    namingConvention: '{Date}_{Client}_{Project}',
    fileVersioning: true,
    versioningFormat: 'v1',
    autoProjectIds: false,
    idPrefix: 'PRJ-',
    idStart: 1,
    idPadding: 3,
  },
  storage: {
    storageLocation: 'D:/Creative',
    enableBackups: true,
    backupFrequency: 'daily',
    backupLocation: 'D:/Backups',
    retentionCount: 5,
    cloudProvider: 'none',
    storageWarningThreshold: 90,
    autoCleanup: false,
    cleanupDays: 30,
    compressBackups: true,
  },
  performance: {
    cacheSize: 500,
    thumbnailGeneration: true,
    thumbnailQuality: 'medium',
    syncFrequency: '30s',
    recentProjectsCount: 10,
    searchIndexing: true,
  },
  security: {
    passwordProtection: false,
    autoLock: false,
    autoLockMinutes: 15,
    dataEncryption: false,
    activityLogging: true,
    analyticsOptIn: false,
  },
  lastUpdated: Date.now(),
};
