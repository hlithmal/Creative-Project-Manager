
import React, { useState, useRef } from 'react';
import { 
  Settings, Monitor, FolderOpen, Save, Shield, Zap, 
  Globe, Database, Command, RefreshCw, ChevronRight, Check, 
  Moon, Sun, MonitorDot, AlertCircle, HardDrive, Download, Upload, Trash2, Sliders, Bell, Info, Search, HelpCircle, Eye,
  Layout, Type, Lock, Activity, EyeOff, FileDigit, Server
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

// --- Reusable UI Components ---

const SectionHeader = ({ title, description }: { title: string, description: string }) => (
    <div className="mb-6 pb-4 border-b border-onyx-800 animate-fadeIn">
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        <p className="text-onyx-400 text-sm">{description}</p>
    </div>
);

const SettingGroup = ({ title, children, id }: { title: string, children?: React.ReactNode, id?: string }) => (
    <div id={id} className="bg-onyx-900 rounded-xl border border-onyx-800 p-6 mb-6 animate-fadeIn transition-colors hover:border-onyx-700">
        <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
        <div className="space-y-5">{children}</div>
    </div>
);

const SettingRow = ({ label, description, children }: { label: string, description?: string, children?: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div className="flex-1 pr-4">
            <div className="text-sm font-medium text-white flex items-center gap-2">
                {label}
                {description && (
                    <div className="group relative">
                        <HelpCircle size={14} className="text-onyx-500 cursor-help" />
                        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 p-2 bg-black text-xs text-onyx-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-onyx-800 shadow-xl">
                            {description}
                        </div>
                    </div>
                )}
            </div>
        </div>
        <div className="flex-shrink-0 min-w-[200px] flex justify-end items-center">
            {children}
        </div>
    </div>
);

const Toggle = ({ checked, onChange, label }: { checked: boolean, onChange: (v: boolean) => void, label?: string }) => (
    <button 
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-accent-500/50 ${checked ? 'bg-accent-600' : 'bg-onyx-800'}`}
        aria-label={label || "Toggle setting"}
    >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform shadow-sm ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
);

const Select = ({ value, options, onChange }: { value: string, options: {value: string, label: string}[], onChange: (v: string) => void }) => (
    <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-onyx-950 border border-onyx-800 text-white text-sm rounded-lg px-3 py-2 w-full focus:border-accent-500 outline-none transition-colors appearance-none cursor-pointer hover:bg-onyx-900"
    >
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
    </select>
);

const Input = ({ value, onChange, type = "text", placeholder, suffix }: any) => (
    <div className="relative w-full">
        <input 
            type={type}
            value={value} 
            onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
            placeholder={placeholder}
            className="w-full bg-onyx-950 border border-onyx-800 text-white text-sm rounded-lg px-3 py-2 focus:border-accent-500 outline-none transition-colors hover:bg-onyx-900 placeholder:text-onyx-600"
        />
        {suffix && <span className="absolute right-3 top-2 text-onyx-500 text-sm">{suffix}</span>}
    </div>
);

const ColorPicker = ({ value, onChange, presets }: { value: string, onChange: (v: string) => void, presets: string[] }) => (
    <div className="flex items-center gap-3">
        <div className="relative">
             <input 
                type="color" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 rounded-full overflow-hidden opacity-0 absolute inset-0 cursor-pointer"
             />
             <div className="w-8 h-8 rounded-full border border-onyx-600 shadow-sm" style={{ backgroundColor: value }} />
        </div>
        <div className="flex gap-1.5">
            {presets.map(c => (
                <button
                    key={c}
                    onClick={() => onChange(c)}
                    className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${value === c ? 'border-white ring-1 ring-white' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                />
            ))}
        </div>
    </div>
);

// --- Sections ---

const GeneralSettings = () => {
    const { settings, updateSetting } = useSettings();
    const s = settings.general;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleBrowse = () => {
        // Trigger hidden file input
        fileInputRef.current?.click();
    };

    const handleDirectorySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Since browsers obscure the real path, we will simulate a realistic path 
            // based on the selected folder name to provide a good UX mock.
            const files = e.target.files;
            const relativePath = files[0].webkitRelativePath;
            const folderName = relativePath ? relativePath.split('/')[0] : 'SelectedFolder';
            
            // Mock path
            const mockPath = `D:/Creative/${folderName}`;
            updateSetting('general', 'projectLocation', mockPath);
        }
    };

    return (
        <div>
            <SectionHeader title="General" description="Basic application preferences and localization." />
            
            <SettingGroup title="Startup & Localization">
                <SettingRow label="Startup Behavior" description="Choose what happens when you launch the app">
                    <Select 
                        value={s.startupBehavior}
                        options={[
                            { value: 'dashboard', label: 'Open to Dashboard' },
                            { value: 'lastProject', label: 'Open Last Viewed Project' },
                            { value: 'minimized', label: 'Start Minimized to Tray' }
                        ]}
                        onChange={(v) => updateSetting('general', 'startupBehavior', v)}
                    />
                </SettingRow>
                
                <SettingRow label="Language">
                    <Select 
                        value={s.language}
                        options={[
                            { value: 'en', label: 'English (US) 🇺🇸' },
                            { value: 'si', label: 'Sinhala (LK) 🇱🇰' },
                            { value: 'ta', label: 'Tamil (LK) 🇱🇰' },
                            { value: 'es', label: 'Spanish (ES) 🇪🇸' },
                            { value: 'fr', label: 'French (FR) 🇫🇷' },
                            { value: 'de', label: 'German (DE) 🇩🇪' },
                        ]}
                        onChange={(v) => updateSetting('general', 'language', v)}
                    />
                </SettingRow>

                <SettingRow label="Currency">
                     <Select 
                        value={s.currency}
                        options={[
                            { value: 'USD', label: 'USD ($) - US Dollar' },
                            { value: 'LKR', label: 'LKR (Rs) - Sri Lankan Rupee' },
                            { value: 'EUR', label: 'EUR (€) - Euro' },
                            { value: 'GBP', label: 'GBP (£) - British Pound' },
                        ]}
                        onChange={(v) => updateSetting('general', 'currency', v)}
                    />
                </SettingRow>
                
                <SettingRow label="Date Format">
                    <Select 
                        value={s.dateFormat}
                        options={[
                            { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (2024-05-15)' },
                            { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (15/05/2024)' },
                            { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (05/15/2024)' },
                        ]}
                        onChange={(v) => updateSetting('general', 'dateFormat', v)}
                    />
                </SettingRow>
            </SettingGroup>

            <SettingGroup title="Time & Location">
                 <SettingRow label="Auto-detect Timezone">
                     <Toggle checked={s.autoDetectTimezone} onChange={(v) => updateSetting('general', 'autoDetectTimezone', v)} />
                 </SettingRow>
                 
                 {!s.autoDetectTimezone && (
                     <SettingRow label="Timezone">
                        <Select 
                            value={s.timezone}
                            options={[
                                { value: 'UTC', label: 'UTC' },
                                { value: 'EST', label: 'Eastern Standard Time' },
                                { value: 'PST', label: 'Pacific Standard Time' },
                            ]}
                            onChange={(v) => updateSetting('general', 'timezone', v)}
                        />
                     </SettingRow>
                 )}

                 <SettingRow label="Default Project Location" description="Where new projects are saved by default">
                     <div className="flex gap-2 w-full">
                         <Input 
                            value={s.projectLocation} 
                            onChange={(v: string) => updateSetting('general', 'projectLocation', v)} 
                         />
                         <button 
                            onClick={handleBrowse} 
                            className="px-3 bg-onyx-800 hover:bg-onyx-700 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                         >
                            Change
                         </button>
                         {/* Hidden Directory Input */}
                         <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleDirectorySelect}
                            className="hidden"
                            {...{ webkitdirectory: "", directory: "" } as any}
                         />
                     </div>
                 </SettingRow>
            </SettingGroup>
        </div>
    );
};

const AppearanceSettings = () => {
    const { settings, updateSetting } = useSettings();
    const s = settings.appearance;

    return (
        <div>
            <SectionHeader title="Appearance" description="Customize how OnyxFlow looks and feels." />

            <SettingGroup title="Theme">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {[
                        { id: 'light', label: 'Light', icon: Sun },
                        { id: 'dark', label: 'Dark', icon: Moon },
                        { id: 'auto', label: 'System', icon: MonitorDot },
                        { id: 'custom', label: 'Custom', icon: Sliders },
                    ].map(opt => (
                        <button 
                            key={opt.id}
                            onClick={() => updateSetting('appearance', 'theme', opt.id)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                                s.theme === opt.id 
                                ? 'bg-accent-600/10 border-accent-500 text-accent-500 shadow-[0_0_15px_rgba(79,70,229,0.1)]' 
                                : 'bg-onyx-950 border-onyx-800 text-onyx-400 hover:border-onyx-600 hover:bg-onyx-900'
                            }`}
                        >
                            <opt.icon size={24} className="mb-2" />
                            <span className="text-sm font-medium">{opt.label}</span>
                        </button>
                    ))}
                </div>
                
                <SettingRow label="Accent Color">
                    <ColorPicker 
                        value={s.accentColor} 
                        onChange={(v) => updateSetting('appearance', 'accentColor', v)}
                        presets={['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4']}
                    />
                </SettingRow>
            </SettingGroup>

            <SettingGroup title="Layout & Density">
                <SettingRow label="Font Size">
                    <Select 
                        value={s.fontSize}
                        options={[
                            { value: 'small', label: 'Small' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'large', label: 'Large' },
                            { value: 'xl', label: 'Extra Large' },
                        ]}
                        onChange={(v) => updateSetting('appearance', 'fontSize', v)}
                    />
                </SettingRow>
                
                <SettingRow label="Sidebar Position">
                     <div className="flex gap-2 bg-onyx-950 p-1 rounded-lg border border-onyx-800">
                        <button 
                            onClick={() => updateSetting('appearance', 'sidebarPosition', 'left')}
                            className={`px-3 py-1.5 text-xs rounded-md transition-colors flex items-center gap-2 ${s.sidebarPosition === 'left' ? 'bg-onyx-800 text-white' : 'text-onyx-400 hover:text-white'}`}
                        >
                            <Layout size={14} className="rotate-180" /> Left
                        </button>
                        <button 
                            onClick={() => updateSetting('appearance', 'sidebarPosition', 'right')}
                            className={`px-3 py-1.5 text-xs rounded-md transition-colors flex items-center gap-2 ${s.sidebarPosition === 'right' ? 'bg-onyx-800 text-white' : 'text-onyx-400 hover:text-white'}`}
                        >
                             Right <Layout size={14} />
                        </button>
                     </div>
                </SettingRow>

                <SettingRow label="View Density">
                     <Select 
                        value={s.viewDensity}
                        options={[
                            { value: 'compact', label: 'Compact' },
                            { value: 'comfortable', label: 'Comfortable' },
                        ]}
                        onChange={(v) => updateSetting('appearance', 'viewDensity', v)}
                    />
                </SettingRow>
                 <SettingRow label="Color Coding" description="Show color tags for project types">
                     <Toggle checked={s.colorCoding} onChange={(v) => updateSetting('appearance', 'colorCoding', v)} />
                 </SettingRow>
            </SettingGroup>
        </div>
    );
};

const ProjectSettings = () => {
    const { settings, updateSetting } = useSettings();
    const s = settings.project;

    return (
        <div>
            <SectionHeader title="Project Settings" description="Configure automation defaults for new projects." />

            <SettingGroup title="Defaults">
                <SettingRow label="Default Status">
                     <Select 
                        value={s.defaultStatus}
                        options={[
                            { value: 'Not Started', label: 'Not Started' },
                            { value: 'In Progress', label: 'In Progress' },
                            { value: 'Review', label: 'Review' },
                        ]}
                        onChange={(v) => updateSetting('project', 'defaultStatus', v)}
                    />
                </SettingRow>
                <SettingRow label="Default Type">
                    <Select 
                        value={s.defaultType}
                        options={[
                            { value: 'Brand Identity', label: 'Brand Identity' },
                            { value: 'Video Edit', label: 'Video Edit' },
                            { value: 'Social Media', label: 'Social Media' },
                            { value: 'Web Design', label: 'Web Design' },
                        ]}
                        onChange={(v) => updateSetting('project', 'defaultType', v)}
                    />
                </SettingRow>
            </SettingGroup>

            <SettingGroup title="Naming & Structure">
                <SettingRow label="Naming Convention" description="Pattern for folder names">
                     <Input 
                        value={s.namingConvention} 
                        onChange={(v: string) => updateSetting('project', 'namingConvention', v)}
                        placeholder="{Date}_{Client}_{Project}"
                     />
                </SettingRow>
                <div className="text-xs text-onyx-500 mb-4 px-1">Available: {'{Date}'}, {'{Client}'}, {'{Project}'}, {'{Year}'}</div>

                <SettingRow label="File Versioning">
                     <Toggle checked={s.fileVersioning} onChange={(v) => updateSetting('project', 'fileVersioning', v)} />
                </SettingRow>
                {s.fileVersioning && (
                    <SettingRow label="Version Format">
                         <Select 
                            value={s.versioningFormat}
                            options={[
                                { value: 'v1', label: '_v1, _v2' },
                                { value: '001', label: '_001, _002' },
                                { value: 'date', label: '_YYYYMMDD' },
                            ]}
                            onChange={(v) => updateSetting('project', 'versioningFormat', v)}
                        />
                    </SettingRow>
                )}

                <SettingRow label="Auto-Generate IDs">
                    <Toggle checked={s.autoProjectIds} onChange={(v) => updateSetting('project', 'autoProjectIds', v)} />
                </SettingRow>
            </SettingGroup>

            <SettingGroup title="Automation">
                <SettingRow label="Auto-Archive Projects">
                    <Toggle checked={s.autoArchive} onChange={(v) => updateSetting('project', 'autoArchive', v)} />
                </SettingRow>
                {s.autoArchive && (
                    <SettingRow label="Archive After (Days)">
                        <Input 
                            type="number"
                            value={s.autoArchiveDays}
                            onChange={(v: number) => updateSetting('project', 'autoArchiveDays', v)}
                            suffix="days"
                        />
                    </SettingRow>
                )}
            </SettingGroup>
        </div>
    );
};

const StorageSettings = () => {
    const { settings, updateSetting } = useSettings();
    const s = settings.storage;
    const [connecting, setConnecting] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleStorageChange = () => {
        fileInputRef.current?.click();
    };

     const handleDirectorySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
             const files = e.target.files;
            const relativePath = files[0].webkitRelativePath;
            const folderName = relativePath ? relativePath.split('/')[0] : 'SelectedFolder';
            
            // Mock path
            const mockPath = `D:/Storage/${folderName}`;
            updateSetting('storage', 'storageLocation', mockPath);
        }
    };

    const handleConnect = (provider: string) => {
        setConnecting(provider);
        setTimeout(() => {
            updateSetting('storage', 'cloudProvider', provider);
            setConnecting(null);
        }, 1500);
    };

    const handleDisconnect = () => {
        if(window.confirm("Disconnect cloud provider?")) {
            updateSetting('storage', 'cloudProvider', 'none');
        }
    };

    return (
        <div>
             <SectionHeader title="Storage & Backup" description="Manage local and cloud storage preferences." />

             <SettingGroup title="Local Storage">
                <div className="mb-6 p-4 bg-onyx-950 rounded-lg border border-onyx-800">
                    <div className="flex justify-between text-sm text-onyx-300 mb-2">
                        <span>Storage Usage ({s.storageLocation.split(':')[0]}:/)</span>
                        <span className="font-mono">450 GB / 1 TB</span>
                    </div>
                    <div className="w-full h-2 bg-onyx-800 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-accent-600 w-[45%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
                    </div>
                    <div className="text-xs text-onyx-500 text-right">45% Used</div>
                </div>

                <SettingRow label="Storage Location">
                     <div className="flex gap-2 w-full">
                         <Input value={s.storageLocation} onChange={(v: string) => updateSetting('storage', 'storageLocation', v)} />
                         <button onClick={handleStorageChange} className="px-3 bg-onyx-800 hover:bg-onyx-700 text-white rounded-lg text-xs font-medium transition-colors whitespace-nowrap">Change</button>
                         <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleDirectorySelect}
                            className="hidden"
                            {...{ webkitdirectory: "", directory: "" } as any}
                         />
                     </div>
                </SettingRow>
                
                <SettingRow label="Low Space Warning">
                     <Input 
                        type="number" 
                        value={s.storageWarningThreshold} 
                        onChange={(v: number) => updateSetting('storage', 'storageWarningThreshold', v)}
                        suffix="GB"
                     />
                </SettingRow>
                
                <SettingRow label="Auto-Cleanup Temp Files">
                    <Toggle checked={s.autoCleanup} onChange={(v) => updateSetting('storage', 'autoCleanup', v)} />
                </SettingRow>
             </SettingGroup>

             <SettingGroup title="Backups">
                 <SettingRow label="Enable Backups">
                      <Toggle checked={s.enableBackups} onChange={(v) => updateSetting('storage', 'enableBackups', v)} />
                 </SettingRow>

                 {s.enableBackups && (
                    <>
                        <SettingRow label="Frequency">
                             <Select 
                                value={s.backupFrequency}
                                options={[
                                    { value: 'daily', label: 'Daily' },
                                    { value: 'weekly', label: 'Weekly' },
                                    { value: 'monthly', label: 'Monthly' },
                                ]}
                                onChange={(v) => updateSetting('storage', 'backupFrequency', v)}
                            />
                        </SettingRow>
                        <SettingRow label="Retention Copies">
                             <Input 
                                type="number"
                                value={s.retentionCount}
                                onChange={(v: number) => updateSetting('storage', 'retentionCount', v)}
                             />
                        </SettingRow>
                        <SettingRow label="Compress Backups">
                             <Toggle checked={s.compressBackups} onChange={(v) => updateSetting('storage', 'compressBackups', v)} />
                        </SettingRow>
                    </>
                 )}
             </SettingGroup>

             <SettingGroup title="Cloud Integration">
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     {[
                         { id: 'google', label: 'Google Drive', icon: Globe },
                         { id: 'dropbox', label: 'Dropbox', icon: FolderOpen },
                         { id: 'onedrive', label: 'OneDrive', icon: HardDrive },
                     ].map(service => (
                         <div key={service.id} className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${s.cloudProvider === service.id ? 'bg-accent-600/10 border-accent-500' : 'bg-onyx-950 border-onyx-800'}`}>
                             <service.icon size={24} className={`mb-3 ${s.cloudProvider === service.id ? 'text-accent-500' : 'text-onyx-400'}`} />
                             <h4 className="text-sm font-medium text-white mb-2">{service.label}</h4>
                             {s.cloudProvider === service.id ? (
                                 <button 
                                    onClick={handleDisconnect}
                                    className="px-3 py-1.5 text-xs rounded-lg transition-colors w-full bg-accent-600 text-white hover:bg-red-500"
                                >
                                    Connected
                                </button>
                             ) : (
                                 <button 
                                    onClick={() => handleConnect(service.id)}
                                    disabled={!!connecting}
                                    className="px-3 py-1.5 text-xs rounded-lg transition-colors w-full bg-onyx-800 text-onyx-300 hover:text-white disabled:opacity-50"
                                >
                                    {connecting === service.id ? 'Connecting...' : 'Connect'}
                                </button>
                             )}
                         </div>
                     ))}
                 </div>
             </SettingGroup>
        </div>
    );
};

const PerformanceSettings = () => {
    const { settings, updateSetting } = useSettings();
    const s = settings.performance;

    return (
        <div>
            <SectionHeader title="Performance" description="Optimize application speed and resource usage." />
            
            <SettingGroup title="Caching & Data">
                <SettingRow label="Cache Size Limit" description="Maximum disk space for temporary files">
                    <div className="flex flex-col w-full max-w-xs items-end gap-2">
                        <input 
                            type="range" 
                            min="100" 
                            max="5000" 
                            step="100" 
                            value={s.cacheSize}
                            onChange={(e) => updateSetting('performance', 'cacheSize', Number(e.target.value))}
                            className="w-full accent-accent-500 h-1 bg-onyx-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-onyx-400 font-mono">{s.cacheSize} MB</span>
                    </div>
                </SettingRow>
                
                <SettingRow label="Thumbnail Generation">
                    <Toggle checked={s.thumbnailGeneration} onChange={(v) => updateSetting('performance', 'thumbnailGeneration', v)} />
                </SettingRow>

                {s.thumbnailGeneration && (
                    <SettingRow label="Thumbnail Quality">
                        <Select 
                            value={s.thumbnailQuality}
                            options={[
                                { value: 'low', label: 'Low (Faster)' },
                                { value: 'medium', label: 'Medium (Balanced)' },
                                { value: 'high', label: 'High (Detailed)' },
                            ]}
                            onChange={(v) => updateSetting('performance', 'thumbnailQuality', v)}
                        />
                    </SettingRow>
                )}
            </SettingGroup>

            <SettingGroup title="Synchronization">
                <SettingRow label="Sync Frequency" description="How often to check for external file changes">
                    <Select 
                        value={s.syncFrequency}
                        options={[
                            { value: 'realtime', label: 'Real-time (High CPU)' },
                            { value: '5s', label: 'Every 5 seconds' },
                            { value: '30s', label: 'Every 30 seconds' },
                            { value: '1m', label: 'Every minute' },
                            { value: 'manual', label: 'Manual only' },
                        ]}
                        onChange={(v) => updateSetting('performance', 'syncFrequency', v)}
                    />
                </SettingRow>

                <SettingRow label="Search Indexing" description="Index files in background for faster search">
                     <Toggle checked={s.searchIndexing} onChange={(v) => updateSetting('performance', 'searchIndexing', v)} />
                </SettingRow>
            </SettingGroup>
        </div>
    );
};

const SecuritySettings = () => {
    const { settings, updateSetting } = useSettings();
    const s = settings.security;

    return (
        <div>
            <SectionHeader title="Security & Privacy" description="Manage access control and data protection." />
            
            <SettingGroup title="Access Control">
                <SettingRow label="Password Protection" description="Require password on startup">
                     <Toggle checked={s.passwordProtection} onChange={(v) => updateSetting('security', 'passwordProtection', v)} />
                </SettingRow>

                <SettingRow label="Auto-Lock" description="Lock app after inactivity">
                     <Toggle checked={s.autoLock} onChange={(v) => updateSetting('security', 'autoLock', v)} />
                </SettingRow>

                {s.autoLock && (
                    <SettingRow label="Auto-Lock Timeout">
                        <Input 
                            type="number"
                            value={s.autoLockMinutes}
                            onChange={(v: number) => updateSetting('security', 'autoLockMinutes', v)}
                            suffix="min"
                        />
                    </SettingRow>
                )}
            </SettingGroup>

            <SettingGroup title="Data Privacy">
                <SettingRow label="Data Encryption" description="Encrypt sensitive client data at rest">
                    <div className="flex items-center gap-2">
                        {s.dataEncryption && <Lock size={14} className="text-green-500" />}
                        <Toggle checked={s.dataEncryption} onChange={(v) => updateSetting('security', 'dataEncryption', v)} />
                    </div>
                </SettingRow>

                <SettingRow label="Activity Logging" description="Keep logs of file operations and changes">
                     <Toggle checked={s.activityLogging} onChange={(v) => updateSetting('security', 'activityLogging', v)} />
                </SettingRow>

                <SettingRow label="Anonymous Analytics" description="Share usage data to help improve OnyxFlow">
                    <div className="flex items-center gap-2">
                        <input 
                            type="checkbox" 
                            checked={s.analyticsOptIn} 
                            onChange={(e) => updateSetting('security', 'analyticsOptIn', e.target.checked)}
                            className="w-5 h-5 rounded bg-onyx-950 border border-onyx-800 accent-accent-500 cursor-pointer"
                        />
                        <span className="text-sm text-onyx-400">{s.analyticsOptIn ? 'Opted In' : 'Opted Out'}</span>
                    </div>
                </SettingRow>
            </SettingGroup>
        </div>
    );
};

const MaintenanceSettings = () => {
    const { resetAll, exportSettings, importSettings, clearCache } = useSettings();
    const [importText, setImportText] = useState('');

    return (
        <div>
             <SectionHeader title="Maintenance" description="Reset settings and manage data." />
             
             <SettingGroup title="Data Management">
                 <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={exportSettings}
                        className="flex items-center justify-center p-4 bg-onyx-950 border border-onyx-800 rounded-xl hover:bg-onyx-900 hover:border-accent-500/50 transition-all group"
                     >
                         <Download size={20} className="mr-3 text-accent-500 group-hover:scale-110 transition-transform" />
                         <span className="text-sm font-medium text-white">Export Settings</span>
                     </button>
                     <label className="flex items-center justify-center p-4 bg-onyx-950 border border-onyx-800 rounded-xl hover:bg-onyx-900 hover:border-accent-500/50 transition-all group cursor-pointer">
                         <Upload size={20} className="mr-3 text-accent-500 group-hover:scale-110 transition-transform" />
                         <span className="text-sm font-medium text-white">Import Settings</span>
                         <input 
                            type="file" 
                            className="hidden" 
                            accept=".json"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                        if (importSettings(ev.target?.result as string)) {
                                            alert("Settings imported successfully!");
                                        } else {
                                            alert("Failed to import settings.");
                                        }
                                    };
                                    reader.readAsText(file);
                                }
                            }}
                         />
                     </label>
                 </div>
                 
                 <div className="mt-4 p-4 bg-onyx-950 rounded-xl border border-onyx-800 flex justify-between items-center">
                     <div>
                         <h4 className="text-sm font-medium text-white">Clear Cache</h4>
                         <p className="text-xs text-onyx-500 mt-1">Free up space by removing temporary files (145 MB)</p>
                     </div>
                     <button 
                        onClick={clearCache}
                        className="px-4 py-2 bg-onyx-800 hover:bg-onyx-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center"
                    >
                         <RefreshCw size={14} className="mr-2" /> Clear
                     </button>
                 </div>
             </SettingGroup>

             <div className="mt-8 pt-6 border-t border-onyx-800">
                 <button 
                    onClick={resetAll}
                    className="text-red-500 hover:text-red-400 text-sm font-medium flex items-center px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors"
                 >
                     <Trash2 size={16} className="mr-2" /> Reset All Settings to Default
                 </button>
             </div>
        </div>
    );
};

// --- Main Settings Page ---

export const SettingsPage = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [searchQuery, setSearchQuery] = useState('');
    const { isSaving } = useSettings();

    const sections = [
        { id: 'general', label: 'General', icon: Settings, keywords: 'language currency date time location' },
        { id: 'appearance', label: 'Appearance', icon: Monitor, keywords: 'theme dark mode font size layout color' },
        { id: 'project', label: 'Project Settings', icon: FolderOpen, keywords: 'status type naming versioning archive' },
        { id: 'storage', label: 'Storage & Backup', icon: Save, keywords: 'backup cloud drive space cleanup' },
        { id: 'performance', label: 'Performance', icon: Zap, keywords: 'cache speed optimization' },
        { id: 'security', label: 'Security & Privacy', icon: Shield, keywords: 'password lock encryption' },
        { id: 'maintenance', label: 'Maintenance', icon: RefreshCw, keywords: 'reset export import' },
    ];

    const filteredSections = sections.filter(s => 
        s.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.keywords.includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full animate-fadeIn bg-onyx-950">
            {/* Settings Sidebar */}
            <div className="w-64 border-r border-onyx-800 bg-onyx-950 flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Settings</h2>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-onyx-500" />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-onyx-900 border border-onyx-800 text-white text-xs rounded-lg pl-9 pr-3 py-2 focus:border-accent-500 outline-none transition-colors placeholder:text-onyx-600"
                        />
                    </div>
                </div>
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4 custom-scrollbar">
                    {filteredSections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                activeSection === section.id 
                                ? 'bg-accent-600 text-white shadow-md' 
                                : 'text-onyx-400 hover:text-white hover:bg-onyx-900'
                            }`}
                        >
                            <section.icon size={18} className={activeSection === section.id ? 'text-white' : 'text-onyx-500 group-hover:text-white'} />
                            <span>{section.label}</span>
                            {activeSection === section.id && <ChevronRight size={14} className="ml-auto opacity-50" />}
                        </button>
                    ))}
                    {filteredSections.length === 0 && (
                        <div className="text-center py-4 text-xs text-onyx-500">
                            No settings found
                        </div>
                    )}
                </nav>
                <div className="p-4 border-t border-onyx-800 text-[10px] text-onyx-600 text-center">
                    Version 1.0.2 • Build 2024.05
                </div>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto bg-onyx-900/30 relative">
                {isSaving && (
                    <div className="absolute top-4 right-8 bg-onyx-800/80 backdrop-blur text-xs px-3 py-1.5 rounded-full text-accent-400 border border-accent-500/20 flex items-center animate-fadeIn z-50">
                        <RefreshCw size={10} className="animate-spin mr-2" /> Saving changes...
                    </div>
                )}
                
                <div className="max-w-4xl mx-auto p-8 sm:p-10 pb-20">
                    {activeSection === 'general' && <GeneralSettings />}
                    {activeSection === 'appearance' && <AppearanceSettings />}
                    {activeSection === 'project' && <ProjectSettings />}
                    {activeSection === 'storage' && <StorageSettings />}
                    {activeSection === 'performance' && <PerformanceSettings />}
                    {activeSection === 'security' && <SecuritySettings />}
                    {activeSection === 'maintenance' && <MaintenanceSettings />}
                </div>
            </div>
        </div>
    );
};
