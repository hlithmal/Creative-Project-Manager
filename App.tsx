import React, { useState, useEffect } from 'react';
import { 
  Layout, FolderPlus, Clock, Settings, Search, 
  Bell, Grid, Plus, X, Wand2, FileBox, Users, CheckCircle, LogOut, RefreshCw
} from 'lucide-react';
import { Project, ProjectStatus, Client, ClientStatus, ProjectTemplate, FolderNode, Notification } from './types';
import { generateProjectNames, suggestFolderStructure } from './services/geminiService';
import { ProjectDetail } from './components/ProjectDetail';
import { AuthPage } from './components/AuthPage';
import { SettingsPage } from './components/SettingsPage';
import { NotificationCenter } from './components/NotificationCenter';
import { ClientManagement } from './components/ClientManagement';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { supabase } from './services/supabaseClient';

// --- MOCK DATA CONSTANTS (Fallback / Initial Templates) ---
const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'n1', category: 'system', title: 'Welcome', message: 'Welcome to OnyxFlow connected to Supabase.', timestamp: 'Just now', read: false, priority: 'normal' },
];

const MOCK_TEMPLATES: ProjectTemplate[] = [
    { 
        id: 't1', 
        name: 'Brand Identity', 
        category: 'Design', 
        structure: [
            { id: 'f1', name: '01_Discovery', type: 'folder', children: [] },
            { id: 'f2', name: '02_Logos', type: 'folder', children: [
                { id: 'f2a', name: 'Drafts', type: 'folder', children: [] },
                { id: 'f2b', name: 'Vector', type: 'folder', children: [] },
            ] },
            { id: 'f3', name: '03_Assets', type: 'folder', children: [] },
            { id: 'f4', name: '04_Final_Exports', type: 'folder', children: [] },
        ]
    },
    { 
        id: 't2', 
        name: 'Video Edit', 
        category: 'Video', 
        structure: [
            { id: 'v1', name: '01_Footage', type: 'folder', children: [
                 { id: 'v1a', name: 'Camera_A', type: 'folder', children: [] },
                 { id: 'v1b', name: 'Camera_B', type: 'folder', children: [] },
            ] },
            { id: 'v2', name: '02_ProjectFiles', type: 'folder', children: [] },
            { id: 'v3', name: '03_Audio', type: 'folder', children: [] },
            { id: 'v4', name: '04_Renders', type: 'folder', children: [] },
        ]
    }
];

// --- COMPONENTS ---

const StatCard = ({ label, value, trend, icon: Icon }: any) => (
    <div className="bg-onyx-900 p-5 rounded-xl border border-onyx-800 hover:border-onyx-700 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-onyx-800 rounded-lg text-onyx-400">
                <Icon size={20} />
            </div>
            {trend && <span className="text-xs text-green-500 bg-green-900/20 px-2 py-1 rounded-full">{trend}</span>}
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-onyx-400">{label}</p>
    </div>
);

// ... CreateProjectModal ...
const CreateProjectModal = ({ isOpen, onClose, onCreate, initialClientId, clients }: any) => {
    const [step, setStep] = useState(1);
    const [selectedClient, setSelectedClient] = useState<string>(initialClientId || '');
    const [selectedType, setSelectedType] = useState<string>('');
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [projectName, setProjectName] = useState('');
    const [isLoadingAI, setIsLoadingAI] = useState(false);

    useEffect(() => {
        if (initialClientId) setSelectedClient(initialClientId);
    }, [initialClientId]);

    const handleGenerateNames = async () => {
        if(!selectedClient || !selectedType) return;
        setIsLoadingAI(true);
        const client = clients.find((c: any) => c.id === selectedClient);
        const names = await generateProjectNames(client?.name || '', selectedType);
        setAiSuggestions(names);
        setIsLoadingAI(false);
    };

    const handleCreate = () => {
        if (!selectedClient || !projectName) return;
        const client = clients.find((c: any) => c.id === selectedClient);
        const template = MOCK_TEMPLATES.find(t => t.name === selectedType) || MOCK_TEMPLATES[0];
        
        const newProject: Partial<Project> = {
            name: projectName,
            client: client!,
            status: ProjectStatus.NOT_STARTED,
            deadline: new Date(Date.now() + 12096e5).toISOString().split('T')[0], // +2 weeks
            progress: 0,
            type: selectedType,
            tags: [selectedType],
            thumbnail: `https://picsum.photos/400/300?random=${Date.now()}`,
            createdAt: new Date().toISOString(),
            timeSpentSeconds: 0,
            folderStructure: template.structure
        };
        onCreate(newProject);
        onClose();
        // Reset state
        setStep(1);
        setProjectName('');
        setAiSuggestions([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-onyx-900 w-full max-w-2xl rounded-2xl border border-onyx-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-onyx-800 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Create New Project</h2>
                    <button onClick={onClose} className="text-onyx-400 hover:text-white"><X size={20} /></button>
                </div>
                
                <div className="p-8 overflow-y-auto flex-1">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-onyx-400 mb-2">Select Client</label>
                                <div className="grid grid-cols-3 gap-4 max-h-48 overflow-y-auto custom-scrollbar">
                                    {clients.map((c: Client) => (
                                        <button 
                                            key={c.id}
                                            onClick={() => setSelectedClient(c.id)}
                                            className={`p-4 rounded-xl border text-left transition-all ${selectedClient === c.id ? 'border-accent-500 bg-accent-500/10' : 'border-onyx-800 bg-onyx-950 hover:border-onyx-700'}`}
                                        >
                                            <div className="flex items-center mb-2">
                                                <img src={c.avatar || 'https://via.placeholder.com/40'} className="w-8 h-8 rounded-full mr-3" alt="" />
                                                <span className="font-medium text-white text-sm truncate">{c.name}</span>
                                            </div>
                                            <p className="text-xs text-onyx-400 truncate">{c.company}</p>
                                        </button>
                                    ))}
                                    <button className="p-4 rounded-xl border border-dashed border-onyx-800 bg-transparent hover:bg-onyx-800 text-onyx-400 flex flex-col items-center justify-center gap-2">
                                        <Plus size={20} />
                                        <span className="text-xs">New Client</span>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-onyx-400 mb-2">Project Type (Template)</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Brand Identity', 'Video Edit', 'Social Media', 'Web Design'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedType(type)}
                                            className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${selectedType === type ? 'border-accent-500 text-white bg-accent-500/10' : 'border-onyx-800 text-onyx-400 hover:text-white bg-onyx-950'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button 
                                disabled={!selectedClient || !selectedType}
                                onClick={() => { setStep(2); handleGenerateNames(); }}
                                className="w-full bg-accent-600 hover:bg-accent-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                            >
                                Continue to Setup
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-onyx-400 mb-2">Project Name</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="w-full bg-onyx-950 border border-onyx-800 rounded-lg p-3 text-white focus:outline-none focus:border-accent-500 pr-12"
                                        placeholder="Enter project name..."
                                    />
                                    <button 
                                        onClick={handleGenerateNames}
                                        disabled={isLoadingAI}
                                        className="absolute right-3 top-3 text-accent-500 hover:text-accent-400 disabled:opacity-50"
                                        title="Regenerate AI Suggestions"
                                    >
                                        <Wand2 size={18} className={isLoadingAI ? 'animate-spin' : ''} />
                                    </button>
                                </div>
                            </div>

                            {aiSuggestions.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs text-onyx-400 flex items-center gap-1"><Wand2 size={12} /> AI Suggestions</p>
                                    <div className="flex flex-wrap gap-2">
                                        {aiSuggestions.map((suggestion, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={() => setProjectName(suggestion)}
                                                className="px-3 py-1.5 bg-onyx-800 hover:bg-onyx-700 rounded-full text-xs text-onyx-300 border border-onyx-700 transition-colors"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-onyx-950 p-4 rounded-lg border border-onyx-800">
                                <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                                    <FileBox size={16} className="text-accent-500"/> 
                                    Preview Folder Structure
                                </h4>
                                <p className="text-xs text-onyx-500 mb-3">Based on {selectedType} template</p>
                                <div className="text-xs text-onyx-400 font-mono space-y-1 pl-2 border-l border-onyx-800">
                                    <div>/ {projectName || '[Project Name]'}</div>
                                    <div className="pl-4">/ 01_Discovery</div>
                                    <div className="pl-4">/ 02_Work_Files</div>
                                    <div className="pl-4">/ 03_Exports</div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="flex-1 py-3 text-onyx-400 hover:text-white transition-colors">Back</button>
                                <button onClick={handleCreate} disabled={!projectName} className="flex-1 bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">
                                    Create Project
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- MAIN APP ---

function AppContent() {
  const [session, setSession] = useState<any>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'projects' | 'clients' | 'reports' | 'settings'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialClientId, setModalInitialClientId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { settings } = useSettings();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
      setLoadingData(true);
      try {
          const { data: clientsData, error: clientError } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
          if (clientError) throw clientError;

          // Projects need client data. Supabase can join.
          // Using column aliases to map snake_case DB columns to camelCase TS interfaces
          const { data: projectsData, error: projectError } = await supabase
              .from('projects')
              .select('*, folderStructure:folder_structure, createdAt:created_at, client:clients(*)')
              .order('created_at', { ascending: false });
          
          if (projectError) throw projectError;

          setClients(clientsData as Client[]);
          setProjects(projectsData as Project[]);

      } catch (err: any) {
          console.error("Error fetching data:", err);
          const newNotification: Notification = {
            id: Date.now().toString(),
            category: 'system',
            title: 'Sync Error',
            message: 'Failed to fetch data from Supabase. Tables might be missing.',
            timestamp: 'Just now',
            read: false,
            priority: 'critical'
          };
          setNotifications(prev => [newNotification, ...prev]);
      } finally {
          setLoadingData(false);
      }
  };

  useEffect(() => {
      if (session) {
          fetchData();
      }
  }, [session]);

  // Derived state for dashboard
  const totalProjects = projects.length;
  const inProgress = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
  const completed = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
  
  // Analytics data
  const data = [
    { name: 'Mon', hours: 4 },
    { name: 'Tue', hours: 6.5 },
    { name: 'Wed', hours: 8 },
    { name: 'Thu', hours: 5 },
    { name: 'Fri', hours: 7.2 },
    { name: 'Sat', hours: 2 },
    { name: 'Sun', hours: 0 },
  ];

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async (project: Partial<Project>) => {
    // Map to DB
    const dbProject = {
        name: project.name,
        client_id: project.client?.id,
        status: project.status,
        deadline: project.deadline,
        progress: project.progress,
        type: project.type,
        tags: project.tags,
        thumbnail: project.thumbnail,
        folder_structure: project.folderStructure, // snake_case mapping handled
    };

    try {
        const { data, error } = await supabase.from('projects')
            .insert(dbProject)
            .select('*, folderStructure:folder_structure, createdAt:created_at, client:clients(*)')
            .single();
        if (error) throw error;
        
        setProjects([data as Project, ...projects]);
        setActiveView('projects');
        
        const newNotification: Notification = {
            id: Date.now().toString(),
            category: 'project',
            title: 'Project Created',
            message: `New project "${project.name}" has been synced to Supabase.`,
            timestamp: 'Just now',
            read: false,
            priority: 'normal'
        };
        setNotifications([newNotification, ...notifications]);
    } catch (error: any) {
        console.error("Create Project Error:", error);
        alert("Failed to create project: " + error.message);
    }
  };

  const handleUpdateStatus = async (id: string, status: ProjectStatus) => {
      try {
          const { error } = await supabase.from('projects').update({ status }).eq('id', id);
          if (error) throw error;

          setProjects(projects.map(p => p.id === id ? { ...p, status } : p));
          if (selectedProject && selectedProject.id === id) {
              setSelectedProject({ ...selectedProject, status });
          }
      } catch(error: any) {
          console.error("Update Status Error", error);
      }
  };

  const handleUpdateClient = async (updatedClient: Client) => {
      try {
          const { error } = await supabase.from('clients').update(updatedClient).eq('id', updatedClient.id);
          if (error) throw error;
          
          setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
          
          const newNotification: Notification = {
            id: Date.now().toString(),
            category: 'client',
            title: 'Client Updated',
            message: `Profile for "${updatedClient.name}" has been updated.`,
            timestamp: 'Just now',
            read: false,
            priority: 'normal'
        };
        setNotifications([newNotification, ...notifications]);

      } catch (error: any) {
          alert("Failed to update client: " + error.message);
      }
  };

  const handleAddClient = async (newClient: Client) => {
      try {
          // Remove ID to let DB generate it if it's integer, or keep if UUID
          const { id, ...clientData } = newClient;
          const { data, error } = await supabase.from('clients').insert(clientData).select().single();
          if (error) throw error;
          
          setClients([data, ...clients]);
           const newNotification: Notification = {
            id: Date.now().toString(),
            category: 'client',
            title: 'New Client Added',
            message: `"${data.name}" has been added to the directory.`,
            timestamp: 'Just now',
            read: false,
            priority: 'normal'
        };
        setNotifications([newNotification, ...notifications]);

      } catch (error: any) {
          alert("Failed to add client: " + error.message);
      }
  };

  const handleDeleteClient = async (clientId: string): Promise<boolean> => {
      const client = clients.find(c => c.id === clientId);
      if (!client) return false;

      // Check for active projects associated with this client
      const clientProjects = projects.filter(p => p.client.id === clientId);
      
      if (clientProjects.length > 0) {
          const confirmCascade = window.confirm(
              `WARNING: ${client.name} has ${clientProjects.length} existing projects.\n\nDeleting this client will also PERMANENTLY DELETE all their projects.\n\nAre you sure you want to proceed?`
          );
          if (!confirmCascade) return false;

          // Manual Cascade Delete: Delete projects first
          try {
             // We use a loop or 'in' query if multiple, but here we delete by client_id which is cleaner
             const { error: projError } = await supabase.from('projects').delete().eq('client_id', clientId);
             if (projError) throw projError;
          } catch(err: any) {
             alert("Failed to clean up client projects: " + err.message);
             return false;
          }
      } else {
           if (!window.confirm(`Are you sure you want to delete ${client.name}? This cannot be undone.`)) {
             return false;
           }
      }

      try {
            const { error } = await supabase.from('clients').delete().eq('id', clientId);
            if (error) throw error;

            setClients(clients.filter(c => c.id !== clientId));
            // Update projects state to remove the projects we just deleted (if any)
            if (clientProjects.length > 0) {
                setProjects(projects.filter(p => p.client.id !== clientId));
            }

            const newNotification: Notification = {
                id: Date.now().toString(),
                category: 'system',
                title: 'Client Deleted',
                message: `Client "${client?.name}" and their data have been removed.`,
                timestamp: 'Just now',
                read: false,
                priority: 'high'
            };
            setNotifications([newNotification, ...notifications]);
            return true;
        } catch (error: any) {
             alert("Failed to delete client: " + error.message);
             return false;
        }
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

  const handleMarkRead = (id: string) => {
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
      setNotifications([]);
  };
  
  const openCreateProjectForClient = (clientId: string) => {
      setModalInitialClientId(clientId);
      setIsModalOpen(true);
  };

  // Helper for currency formatting
  const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
      let symbol = '$';
      if (currencyCode === 'EUR') symbol = '€';
      if (currencyCode === 'GBP') symbol = '£';
      if (currencyCode === 'LKR') symbol = 'Rs';
      // ... add others
      return `${symbol}${amount ? amount.toLocaleString() : '0'}`;
  }

  // --- AUTH CHECK ---
  if (!session) {
      return <AuthPage onLogin={() => {}} />;
  }

  // --- PROJECT DETAIL VIEW ---
  if (selectedProject) {
      return (
          <ProjectDetail 
            project={selectedProject} 
            onBack={() => setSelectedProject(null)} 
            onUpdateStatus={handleUpdateStatus}
          />
      );
  }

  const Sidebar = () => (
      <aside className="w-64 bg-onyx-950 border-r border-onyx-800 flex flex-col flex-shrink-0 z-20">
        <div className="p-6 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-accent-600 to-blue-400 rounded-lg flex items-center justify-center">
                <FolderPlus size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">OnyxFlow</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
            {[
                { id: 'dashboard', label: 'Dashboard', icon: Layout },
                { id: 'projects', label: 'Projects', icon: FolderPlus },
                { id: 'clients', label: 'Clients', icon: Users },
                { id: 'reports', label: 'Reports', icon: FileBox },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeView === item.id 
                        ? 'bg-onyx-900 text-white shadow-sm border border-onyx-800' 
                        : 'text-onyx-400 hover:text-white hover:bg-onyx-900/50'
                    }`}
                >
                    <item.icon size={18} />
                    <span className="font-medium text-sm">{item.label}</span>
                </button>
            ))}
        </nav>

        <div className="p-4 border-t border-onyx-800">
             <button
                onClick={() => setActiveView('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-onyx-400 hover:text-white cursor-pointer transition-colors rounded-xl ${activeView === 'settings' ? 'bg-onyx-900 text-white' : ''}`}
            >
                <Settings size={18} />
                <span className="font-medium text-sm">Settings</span>
            </button>
            <div className="flex items-center justify-between mt-2 pl-4 pr-2 py-3 bg-onyx-900/50 rounded-xl border border-onyx-800/50">
                 <div className="flex items-center space-x-3">
                    <img src="https://via.placeholder.com/40" className="w-8 h-8 rounded-full border border-onyx-700" alt="User" />
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white max-w-[100px] truncate">{session.user.email}</span>
                        <span className="text-[10px] text-onyx-500">Online</span>
                    </div>
                 </div>
                 <button 
                    onClick={handleLogout}
                    className="p-1.5 text-onyx-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Log Out"
                 >
                    <LogOut size={16} />
                 </button>
            </div>
        </div>
      </aside>
  );

  // --- MAIN APP LAYOUT ---
  return (
    <div className={`flex h-screen bg-onyx-950 text-onyx-100 overflow-hidden font-sans animate-fadeIn ${settings.appearance.sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 border-b border-onyx-800 flex items-center justify-between px-8 bg-onyx-950/50 backdrop-blur-md z-10 relative">
            <div className="flex items-center w-96 bg-onyx-900 rounded-lg px-3 py-2 border border-onyx-800 focus-within:border-accent-500 transition-colors">
                <Search size={16} className="text-onyx-500 mr-2" />
                <input 
                    type="text" 
                    placeholder="Search projects, clients..." 
                    className="bg-transparent border-none focus:outline-none text-sm w-full text-white placeholder-onyx-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => { setModalInitialClientId(''); setIsModalOpen(true); }}
                    className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                    <Plus size={16} className="mr-2" /> New Project
                </button>
                <div className="w-px h-6 bg-onyx-800 mx-2"></div>
                <button 
                    className="text-onyx-400 hover:text-white relative p-1 transition-colors"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    <Bell size={20} />
                    {notifications.some(n => !n.read) && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-onyx-950"></span>
                    )}
                </button>
                {showNotifications && (
                    <NotificationCenter 
                        notifications={notifications}
                        onClose={() => setShowNotifications(false)}
                        onMarkRead={handleMarkRead}
                        onMarkAllRead={handleMarkAllRead}
                        onClearAll={handleClearAll}
                    />
                )}
            </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto bg-onyx-950 scroll-smooth">
            
            {activeView === 'settings' && <SettingsPage />}
            
            {activeView === 'clients' && (
                <ClientManagement 
                    clients={clients} 
                    projects={projects}
                    onUpdateClient={handleUpdateClient}
                    onAddClient={handleAddClient}
                    onDeleteClient={handleDeleteClient}
                    onCreateProject={openCreateProjectForClient}
                />
            )}

            {activeView === 'dashboard' && (
                <div className={`p-8 space-y-8 animate-fadeIn ${settings.appearance.viewDensity === 'compact' ? 'gap-4 space-y-4' : 'gap-6 space-y-8'}`}>
                    {loadingData && (
                        <div className="w-full flex items-center justify-center py-4 bg-onyx-900 border border-onyx-800 rounded-lg text-accent-500">
                             <RefreshCw className="animate-spin mr-2" size={16} /> Syncing with Supabase...
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard label="Active Projects" value={inProgress} trend={inProgress > 0 ? "+ Active" : "No Activity"} icon={FolderPlus} />
                        <StatCard label="Completed" value={completed} trend={completed > 0 ? "+ Done" : ""} icon={CheckCircle} />
                        <StatCard label="Hours Tracked" value="34.5h" trend="Billable" icon={Clock} />
                        <StatCard label="Pending Revenue" value={formatCurrency(4250, settings.general.currency)} icon={Grid} />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 bg-onyx-900 p-6 rounded-2xl border border-onyx-800">
                            <h3 className="text-lg font-bold text-white mb-6">Weekly Activity</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                                        <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#121212', borderColor: '#2A2A2A', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            cursor={{ fill: '#2A2A2A', opacity: 0.4 }}
                                        />
                                        <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 2 ? '#4f46e5' : '#2A2A2A'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="col-span-1 bg-onyx-900 p-6 rounded-2xl border border-onyx-800 flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-4">Recent Projects</h3>
                            <div className="flex-1 space-y-4 overflow-auto">
                                {projects.length === 0 ? (
                                    <p className="text-xs text-onyx-500 text-center py-10">No projects yet</p>
                                ) : (
                                projects.slice(0, 4).map(p => (
                                    <div key={p.id} onClick={() => setSelectedProject(p)} className="flex items-center p-3 hover:bg-onyx-800 rounded-lg cursor-pointer transition-colors group">
                                        <div className="w-10 h-10 rounded bg-onyx-800 mr-3 overflow-hidden border border-onyx-700">
                                            <img src={p.thumbnail} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-white truncate group-hover:text-accent-400 transition-colors">{p.name}</h4>
                                            <p className="text-xs text-onyx-500 truncate">{p.client?.name}</p>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                            p.status === ProjectStatus.IN_PROGRESS ? 'border-blue-900 text-blue-400 bg-blue-900/10' : 
                                            p.status === ProjectStatus.COMPLETED ? 'border-green-900 text-green-400 bg-green-900/10' : 
                                            'border-onyx-700 text-onyx-400'
                                        }`}>{p.status}</span>
                                    </div>
                                )))}
                            </div>
                            <button onClick={() => setActiveView('projects')} className="mt-4 w-full py-2 text-xs text-onyx-400 hover:text-white border border-onyx-800 hover:border-onyx-600 rounded-lg transition-all">
                                View All Projects
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'projects' && (
                <div className="p-8 animate-fadeIn">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">All Projects</h2>
                        <div className="flex space-x-2">
                             <select className="bg-onyx-900 text-xs text-onyx-300 border border-onyx-800 rounded px-3 py-2 outline-none">
                                <option>Sort by Date</option>
                                <option>Sort by Name</option>
                             </select>
                        </div>
                    </div>
                    
                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-onyx-800 rounded-xl bg-onyx-900/20">
                            <p className="text-onyx-500">No projects found. Create one to get started.</p>
                        </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProjects.map(project => (
                            <div 
                                key={project.id} 
                                onClick={() => setSelectedProject(project)}
                                className="group bg-onyx-900 rounded-xl border border-onyx-800 overflow-hidden hover:border-accent-500/50 hover:shadow-[0_0_20px_rgba(79,70,229,0.1)] transition-all cursor-pointer flex flex-col"
                            >
                                <div className="h-40 overflow-hidden relative">
                                    <img src={project.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={project.name} />
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded border border-white/10">
                                            {project.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <p className="text-xs text-accent-500 font-medium mb-1 uppercase tracking-wider">{project.type}</p>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent-400 transition-colors">{project.name}</h3>
                                        <p className="text-xs text-onyx-400 mb-4 flex items-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-onyx-600 mr-2"></span>
                                            {project.client?.name}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-onyx-800 flex justify-between items-center text-xs text-onyx-500">
                                        <span>Due {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
                                        <div className="flex items-center">
                                            <div className="w-16 h-1.5 bg-onyx-800 rounded-full mr-2 overflow-hidden">
                                                <div className="h-full bg-accent-600 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                            </div>
                                            <span>{project.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            )}
        </div>
      </main>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateProject}
        initialClientId={modalInitialClientId}
        clients={clients}
      />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}