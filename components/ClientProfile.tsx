
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Star, Mail, Phone, MapPin, Globe, 
  Edit, MoreVertical, Plus, FileText, Calendar, 
  DollarSign, Clock, CheckCircle, Briefcase, User, ExternalLink, Trash2, Check, X
} from 'lucide-react';
import { Client, Project, ClientStatus, ProjectStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ClientProfileProps {
  client: Client;
  projects: Project[];
  onBack: () => void;
  onUpdateClient: (updatedClient: Client) => void;
  onCreateProject: (clientId: string) => void;
  onDeleteClient: () => void;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({ 
  client, projects, onBack, onUpdateClient, onCreateProject, onDeleteClient 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'financials' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Client>(client);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Tag state
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Sync edit form when client prop changes
  useEffect(() => {
    setEditForm(client);
  }, [client]);

  const activeProjects = projects.filter(p => p.status !== ProjectStatus.COMPLETED && p.status !== ProjectStatus.ON_HOLD).length;
  const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;

  // Mock Financial Data
  const financialData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 2100 },
    { month: 'Mar', amount: 800 },
    { month: 'Apr', amount: 1600 },
    { month: 'May', amount: 2400 },
    { month: 'Jun', amount: 3200 },
  ];

  const handleSave = () => {
      onUpdateClient(editForm);
      setIsEditing(false);
      setActiveTab('overview');
  };

  const handleAddTag = () => {
      if (newTag.trim()) {
          const updatedTags = [...client.tags, newTag.trim()];
          onUpdateClient({ ...client, tags: updatedTags });
          setNewTag('');
          setIsAddingTag(false);
      }
  };

  const handleEditToggle = () => {
      if (!isEditing) {
          setIsEditing(true);
          setActiveTab('settings');
      } else {
          setIsEditing(false);
          setActiveTab('overview');
          setEditForm(client); // Reset form
      }
  };

  const renderStars = (rating: number) => {
    return (
        <div className="flex text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} fill={star <= rating ? "currentColor" : "none"} className={star <= rating ? "" : "text-onyx-600"} />
            ))}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-onyx-950 animate-fadeIn" onClick={() => setMenuOpen(false)}>
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-onyx-900 to-onyx-800 border-b border-onyx-800">
          <div className="absolute top-6 left-6 z-10">
            <button onClick={onBack} className="text-white/70 hover:text-white flex items-center text-sm bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full transition-colors">
                <ChevronRight className="rotate-180 mr-1" size={14} /> Back to Directory
            </button>
          </div>
          
          <div className="absolute -bottom-10 left-8 flex items-end">
              <div className="w-24 h-24 rounded-2xl border-4 border-onyx-950 overflow-hidden bg-onyx-800 shadow-xl">
                  <img src={client.avatar} className="w-full h-full object-cover" alt={client.name} />
              </div>
              <div className="ml-4 mb-3">
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      {client.name}
                      {client.status === ClientStatus.ACTIVE && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>}
                  </h1>
                  <div className="flex items-center text-onyx-300 text-sm gap-2">
                      <span>{client.company}</span>
                      <span className="w-1 h-1 rounded-full bg-onyx-500"></span>
                      <span className="text-accent-400">{client.industry}</span>
                  </div>
              </div>
          </div>

          <div className="absolute bottom-4 right-8 flex gap-3 relative">
              <button 
                onClick={() => onCreateProject(client.id)}
                className="bg-accent-600 hover:bg-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-lg transition-colors"
              >
                  <Plus size={16} className="mr-2" /> New Project
              </button>
              <button 
                onClick={handleEditToggle}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${isEditing ? 'bg-onyx-800 text-white border-onyx-600' : 'bg-onyx-800 hover:bg-onyx-700 text-white border-onyx-700'}`}
              >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
              <button 
                 onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                 className="bg-onyx-800 hover:bg-onyx-700 text-white p-2 rounded-lg border border-onyx-700 transition-colors"
              >
                  <MoreVertical size={20} />
              </button>

              {menuOpen && (
                  <div className="absolute top-12 right-0 w-40 bg-onyx-950 border border-onyx-800 rounded-lg shadow-xl z-20 overflow-hidden animate-fadeIn">
                      <button 
                         onClick={onDeleteClient}
                         className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-onyx-900 flex items-center"
                      >
                          <Trash2 size={14} className="mr-2" /> Delete Client
                      </button>
                  </div>
              )}
          </div>
      </div>

      {/* Stats Bar */}
      <div className="mt-14 px-8 grid grid-cols-4 gap-4 pb-6 border-b border-onyx-800">
           <div className="bg-onyx-900/50 p-4 rounded-xl border border-onyx-800">
               <div className="text-onyx-400 text-xs uppercase tracking-wider mb-1">Total Revenue</div>
               <div className="text-2xl font-mono text-white">${client.totalRevenue.toLocaleString()}</div>
           </div>
           <div className="bg-onyx-900/50 p-4 rounded-xl border border-onyx-800">
               <div className="text-onyx-400 text-xs uppercase tracking-wider mb-1">Active Projects</div>
               <div className="text-2xl font-mono text-white">{activeProjects}</div>
           </div>
           <div className="bg-onyx-900/50 p-4 rounded-xl border border-onyx-800">
               <div className="text-onyx-400 text-xs uppercase tracking-wider mb-1">Client Rating</div>
               <div className="mt-1">{renderStars(client.rating)}</div>
           </div>
           <div className="bg-onyx-900/50 p-4 rounded-xl border border-onyx-800">
               <div className="text-onyx-400 text-xs uppercase tracking-wider mb-1">Status</div>
               <span className={`inline-block px-2 py-0.5 text-sm rounded ${
                   client.status === ClientStatus.ACTIVE ? 'bg-green-900/20 text-green-400 border border-green-900/50' : 
                   client.status === ClientStatus.PROSPECTIVE ? 'bg-blue-900/20 text-blue-400 border border-blue-900/50' :
                   'bg-onyx-800 text-onyx-400 border border-onyx-700'
               }`}>
                   {client.status}
               </span>
           </div>
      </div>

      {/* Navigation */}
      <div className="px-8 border-b border-onyx-800 flex gap-6">
           {['overview', 'projects', 'financials', 'settings'].map(tab => (
               <button
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`py-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                       activeTab === tab ? 'text-white border-accent-500' : 'text-onyx-400 border-transparent hover:text-white'
                   }`}
               >
                   {tab}
               </button>
           ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
            {activeTab === 'overview' && (
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {/* Contact Info */}
                        <div className="bg-onyx-900 rounded-xl border border-onyx-800 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Contact Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center text-sm text-onyx-300">
                                    <Mail size={16} className="mr-3 text-onyx-500" />
                                    {client.email}
                                </div>
                                <div className="flex items-center text-sm text-onyx-300">
                                    <Phone size={16} className="mr-3 text-onyx-500" />
                                    {client.phone}
                                </div>
                                <div className="flex items-center text-sm text-onyx-300">
                                    <Globe size={16} className="mr-3 text-onyx-500" />
                                    <a href={client.website} target="_blank" rel="noreferrer" className="hover:text-accent-400 flex items-center">
                                        {client.website || 'No website'} <ExternalLink size={12} className="ml-1 opacity-50"/>
                                    </a>
                                </div>
                                <div className="flex items-center text-sm text-onyx-300">
                                    <MapPin size={16} className="mr-3 text-onyx-500" />
                                    {client.city}, {client.country}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-onyx-900 rounded-xl border border-onyx-800 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: Briefcase, text: 'New Project "Summer Campaign" created', time: '2 days ago' },
                                    { icon: FileText, text: 'Invoice #INV-2024-001 sent', time: '5 days ago' },
                                    { icon: Mail, text: 'Email interaction logged', time: '1 week ago' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start">
                                        <div className="w-8 h-8 rounded-full bg-onyx-800 flex items-center justify-center mr-3 mt-0.5 border border-onyx-700 text-onyx-400">
                                            <item.icon size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-white">{item.text}</p>
                                            <p className="text-xs text-onyx-500">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 space-y-8">
                        {/* Notes */}
                        <div className="bg-onyx-900 rounded-xl border border-onyx-800 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Internal Notes</h3>
                            <p className="text-sm text-onyx-300 leading-relaxed bg-onyx-950 p-4 rounded-lg border border-onyx-800">
                                {client.notes || "No notes available."}
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="bg-onyx-900 rounded-xl border border-onyx-800 p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {client.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-onyx-800 border border-onyx-700 text-xs text-onyx-300">
                                        {tag}
                                    </span>
                                ))}
                                {isAddingTag ? (
                                    <div className="flex items-center gap-1">
                                        <input 
                                            type="text" 
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                            autoFocus
                                            className="px-2 py-1 w-20 rounded bg-onyx-950 border border-accent-500 text-xs text-white outline-none"
                                            placeholder="Tag..."
                                        />
                                        <button onClick={handleAddTag} className="p-1 hover:text-accent-500 text-onyx-400"><Check size={12} /></button>
                                        <button onClick={() => setIsAddingTag(false)} className="p-1 hover:text-red-500 text-onyx-400"><X size={12} /></button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsAddingTag(true)}
                                        className="px-3 py-1 rounded-full border border-dashed border-onyx-600 text-xs text-onyx-400 hover:text-white hover:border-onyx-400 transition-colors"
                                    >
                                        + Add
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'projects' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-onyx-500">
                            <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No projects found for this client.</p>
                            <button onClick={() => onCreateProject(client.id)} className="mt-4 text-accent-500 hover:text-accent-400 text-sm">Create First Project</button>
                        </div>
                        ) : (
                        projects.map(project => (
                            <div 
                                key={project.id} 
                                className="group bg-onyx-900 rounded-xl border border-onyx-800 overflow-hidden hover:border-accent-500/50 hover:shadow-[0_0_20px_rgba(79,70,229,0.1)] transition-all cursor-pointer flex flex-col"
                            >
                                <div className="h-32 overflow-hidden relative">
                                    <img src={project.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={project.name} />
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded border border-white/10">
                                            {project.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 flex-1">
                                    <p className="text-xs text-accent-500 font-medium mb-1 uppercase tracking-wider">{project.type}</p>
                                    <h3 className="text-base font-bold text-white mb-3 group-hover:text-accent-400 transition-colors">{project.name}</h3>
                                    
                                    <div className="flex justify-between items-center text-xs text-onyx-500">
                                        <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-onyx-800 rounded-full mt-2 overflow-hidden">
                                        <div className="h-full bg-accent-600 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))
                        )}
                </div>
            )}

            {activeTab === 'financials' && (
                <div className="space-y-8">
                        <div className="grid grid-cols-3 gap-6">
                        <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
                            <h4 className="text-sm text-onyx-400 mb-2">Lifetime Value</h4>
                            <div className="text-3xl font-mono text-white">${(client.totalRevenue * 1.2).toLocaleString()}</div>
                        </div>
                        <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
                            <h4 className="text-sm text-onyx-400 mb-2">Outstanding Balance</h4>
                            <div className="text-3xl font-mono text-red-400">$850.00</div>
                        </div>
                        <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
                            <h4 className="text-sm text-onyx-400 mb-2">Avg. Project Value</h4>
                            <div className="text-3xl font-mono text-white">${(client.totalRevenue / (projects.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                        </div>

                        <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
                        <h3 className="text-lg font-semibold text-white mb-6">Revenue History (6 Months)</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={financialData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                                    <XAxis dataKey="month" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#121212', borderColor: '#2A2A2A', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: '#2A2A2A', opacity: 0.4 }}
                                    />
                                    <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        </div>
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto bg-onyx-900 p-8 rounded-xl border border-onyx-800">
                    <h3 className="text-xl font-bold text-white mb-6">Edit Client Profile</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-onyx-300">Company Name</label>
                                <input 
                                    type="text" 
                                    value={editForm.company} 
                                    onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                                    className="w-full bg-onyx-950 border border-onyx-800 text-white rounded-lg p-3 focus:border-accent-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-onyx-300">Contact Name</label>
                                <input 
                                    type="text" 
                                    value={editForm.name} 
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full bg-onyx-950 border border-onyx-800 text-white rounded-lg p-3 focus:border-accent-500 outline-none"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-onyx-300">Email Address</label>
                                <input 
                                    type="email" 
                                    value={editForm.email} 
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="w-full bg-onyx-950 border border-onyx-800 text-white rounded-lg p-3 focus:border-accent-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-onyx-300">Phone</label>
                                <input 
                                    type="text" 
                                    value={editForm.phone} 
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    className="w-full bg-onyx-950 border border-onyx-800 text-white rounded-lg p-3 focus:border-accent-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-onyx-300">Website</label>
                            <input 
                                type="text" 
                                value={editForm.website} 
                                onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                                className="w-full bg-onyx-950 border border-onyx-800 text-white rounded-lg p-3 focus:border-accent-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-onyx-300">Status</label>
                            <select 
                                value={editForm.status} 
                                onChange={(e) => setEditForm({...editForm, status: e.target.value as ClientStatus})}
                                className="w-full bg-onyx-950 border border-onyx-800 text-white rounded-lg p-3 focus:border-accent-500 outline-none"
                            >
                                {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-onyx-300">Internal Notes</label>
                            <textarea 
                                rows={4}
                                value={editForm.notes} 
                                onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                                className="w-full bg-onyx-950 border border-onyx-800 text-white rounded-lg p-3 focus:border-accent-500 outline-none"
                            />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button 
                                onClick={handleEditToggle}
                                className="px-6 py-2 text-onyx-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-6 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-lg font-medium transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
      </div>
    </div>
  );
};
