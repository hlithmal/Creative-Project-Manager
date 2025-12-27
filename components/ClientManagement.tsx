
import React, { useState } from 'react';
import { 
  Search, Plus, Grid, List, Filter, Download, MoreVertical, 
  Mail, Phone, Star, Building, User, X, Trash2, Edit
} from 'lucide-react';
import { Client, ClientStatus, Project } from '../types';
import { ClientProfile } from './ClientProfile';

interface ClientManagementProps {
  clients: Client[];
  projects: Project[];
  onUpdateClient: (client: Client) => void;
  onAddClient: (client: Client) => void;
  onDeleteClient: (id: string) => Promise<boolean>;
  onCreateProject: (clientId: string) => void;
}

const AddClientModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (client: Client) => void }) => {
    const [formData, setFormData] = useState<Partial<Client>>({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: ClientStatus.ACTIVE,
        type: 'Individual',
        rating: 0,
        totalRevenue: 0,
        tags: [],
        avatar: `https://picsum.photos/100/100?random=${Date.now()}`
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newClient: Client = {
            id: Date.now().toString(),
            name: formData.name || 'New Client',
            company: formData.company || '',
            email: formData.email || '',
            phone: formData.phone || '',
            avatar: formData.avatar || '',
            type: formData.type as any,
            status: formData.status as ClientStatus,
            rating: formData.rating || 0,
            tags: [],
            address: '',
            city: '',
            country: '',
            totalRevenue: 0,
            currency: 'USD',
            joinedDate: new Date().toISOString(),
            industry: '',
            website: '',
            notes: ''
        };
        onAdd(newClient);
        onClose();
        setFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            status: ClientStatus.ACTIVE,
            type: 'Individual',
            rating: 0,
            totalRevenue: 0,
            tags: [],
            avatar: `https://picsum.photos/100/100?random=${Date.now()}`
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-onyx-900 w-full max-w-lg rounded-2xl border border-onyx-800 shadow-2xl flex flex-col">
                <div className="p-6 border-b border-onyx-800 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Add New Client</h2>
                    <button onClick={onClose} className="text-onyx-400 hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-onyx-400">Name</label>
                            <input 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-onyx-950 border border-onyx-800 rounded-lg p-2.5 text-white focus:border-accent-500 outline-none"
                                placeholder="Client Name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-onyx-400">Company</label>
                            <input 
                                value={formData.company}
                                onChange={e => setFormData({...formData, company: e.target.value})}
                                className="w-full bg-onyx-950 border border-onyx-800 rounded-lg p-2.5 text-white focus:border-accent-500 outline-none"
                                placeholder="Company Name"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-onyx-400">Email</label>
                            <input 
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-onyx-950 border border-onyx-800 rounded-lg p-2.5 text-white focus:border-accent-500 outline-none"
                                placeholder="email@example.com"
                            />
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-medium text-onyx-400">Phone</label>
                            <input 
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full bg-onyx-950 border border-onyx-800 rounded-lg p-2.5 text-white focus:border-accent-500 outline-none"
                                placeholder="+1 555 000 0000"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-onyx-400">Type</label>
                             <select 
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value as any})}
                                className="w-full bg-onyx-950 border border-onyx-800 rounded-lg p-2.5 text-white focus:border-accent-500 outline-none"
                            >
                                <option>Individual</option>
                                <option>Small Business</option>
                                <option>Agency</option>
                                <option>Corporation</option>
                            </select>
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-medium text-onyx-400">Status</label>
                             <select 
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value as any})}
                                className="w-full bg-onyx-950 border border-onyx-800 rounded-lg p-2.5 text-white focus:border-accent-500 outline-none"
                            >
                                {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 text-onyx-400 hover:text-white font-medium">Cancel</button>
                        <button type="submit" className="flex-1 bg-accent-600 hover:bg-accent-500 text-white rounded-lg font-medium py-2.5">Add Client</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ 
  clients, projects, onUpdateClient, onAddClient, onDeleteClient, onCreateProject 
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Filter clients
  const filteredClients = clients.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
  });

  const getClientProjectCount = (clientId: string) => {
      return projects.filter(p => p.client.id === clientId).length;
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setMenuOpenId(menuOpenId === id ? null : id);
  };

  if (selectedClient) {
      return (
          <ClientProfile 
            client={selectedClient} 
            projects={projects.filter(p => p.client.id === selectedClient.id)} 
            onBack={() => setSelectedClient(null)} 
            onUpdateClient={(updated) => {
                onUpdateClient(updated);
                setSelectedClient(updated);
            }}
            onCreateProject={onCreateProject}
            onDeleteClient={async () => {
                const success = await onDeleteClient(selectedClient.id);
                if (success) {
                    setSelectedClient(null);
                }
            }}
          />
      );
  }

  return (
    <div className="h-full flex flex-col animate-fadeIn" onClick={() => setMenuOpenId(null)}>
       {/* Header */}
       <div className="p-8 border-b border-onyx-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <h1 className="text-2xl font-bold text-white mb-1">Client Directory</h1>
               <p className="text-onyx-400 text-sm">Manage your relationships and client profiles</p>
           </div>
           
           <div className="flex items-center gap-3">
               <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors shadow-lg"
               >
                   <Plus size={16} className="mr-2" /> Add Client
               </button>
           </div>
       </div>

       {/* Controls */}
       <div className="px-8 py-4 border-b border-onyx-800 flex flex-wrap items-center justify-between gap-4 bg-onyx-900/30">
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3 top-2.5 text-onyx-500" />
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-onyx-950 border border-onyx-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-accent-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-onyx-950 border border-onyx-800 text-white text-sm rounded-lg px-3 py-2 pr-8 outline-none appearance-none cursor-pointer focus:border-accent-500"
                    >
                        <option value="all">All Status</option>
                        {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Filter size={12} className="absolute right-3 top-3 text-onyx-500 pointer-events-none" />
                </div>
            </div>

            <div className="flex items-center gap-2 border-l border-onyx-800 pl-4">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-onyx-800 text-white' : 'text-onyx-400 hover:text-white'}`}
                >
                    <Grid size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-onyx-800 text-white' : 'text-onyx-400 hover:text-white'}`}
                >
                    <List size={18} />
                </button>
                <div className="w-px h-6 bg-onyx-800 mx-1"></div>
                 <button className="p-2 text-onyx-400 hover:text-white">
                    <Download size={18} />
                </button>
            </div>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-auto p-8">
           {filteredClients.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-onyx-500">
                   <User size={64} className="mb-4 opacity-20" />
                   <p className="text-lg">No clients found</p>
                   <p className="text-sm">Try adjusting your filters or search query</p>
               </div>
           ) : viewMode === 'grid' ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {filteredClients.map(client => (
                       <div 
                            key={client.id} 
                            onClick={() => setSelectedClient(client)}
                            className="bg-onyx-900 border border-onyx-800 rounded-xl p-6 hover:border-accent-500/50 hover:shadow-lg transition-all cursor-pointer group relative"
                       >
                           <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center">
                                   <div className="w-12 h-12 rounded-full border border-onyx-700 overflow-hidden mr-3">
                                       <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                       <h3 className="text-white font-bold group-hover:text-accent-400 transition-colors">{client.name}</h3>
                                       <p className="text-xs text-onyx-400">{client.company}</p>
                                   </div>
                               </div>
                               <button 
                                  onClick={(e) => toggleMenu(e, client.id)}
                                  className="text-onyx-500 hover:text-white p-1 rounded hover:bg-onyx-800 transition-colors"
                               >
                                   <MoreVertical size={16} />
                               </button>
                               {menuOpenId === client.id && (
                                   <div className="absolute top-12 right-4 w-32 bg-onyx-950 border border-onyx-800 rounded-lg shadow-xl z-20 overflow-hidden animate-fadeIn">
                                       <button className="w-full text-left px-4 py-2 text-xs text-white hover:bg-onyx-900 flex items-center">
                                           <Edit size={12} className="mr-2" /> Edit
                                       </button>
                                       <button 
                                          onClick={(e) => { e.stopPropagation(); onDeleteClient(client.id); }}
                                          className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-onyx-900 flex items-center"
                                       >
                                           <Trash2 size={12} className="mr-2" /> Delete
                                       </button>
                                   </div>
                               )}
                           </div>

                           <div className="grid grid-cols-2 gap-2 mb-4">
                               <div className="bg-onyx-950 p-2 rounded border border-onyx-800 text-center">
                                   <span className="block text-[10px] text-onyx-500 uppercase">Revenue</span>
                                   <span className="text-xs font-mono text-white">${client.totalRevenue.toLocaleString()}</span>
                               </div>
                               <div className="bg-onyx-950 p-2 rounded border border-onyx-800 text-center">
                                   <span className="block text-[10px] text-onyx-500 uppercase">Projects</span>
                                   <span className="text-xs font-mono text-white">{getClientProjectCount(client.id)}</span>
                               </div>
                           </div>

                           <div className="flex justify-between items-center text-xs text-onyx-400 border-t border-onyx-800 pt-4">
                               <span className={`px-2 py-0.5 rounded border ${
                                   client.status === ClientStatus.ACTIVE ? 'border-green-900 text-green-400 bg-green-900/10' : 
                                   'border-onyx-700 text-onyx-500'
                               }`}>
                                   {client.status}
                               </span>
                               <div className="flex gap-2">
                                   <button className="hover:text-accent-500 transition-colors"><Mail size={14} /></button>
                                   <button className="hover:text-accent-500 transition-colors"><Phone size={14} /></button>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
           ) : (
               <div className="bg-onyx-900 border border-onyx-800 rounded-xl overflow-hidden">
                   <table className="w-full text-left text-sm">
                        <thead className="bg-onyx-950 text-onyx-400 uppercase text-xs font-medium border-b border-onyx-800">
                            <tr>
                                <th className="px-6 py-4">Client Name</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Projects</th>
                                <th className="px-6 py-4">Revenue</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-onyx-800">
                            {filteredClients.map(client => (
                                <tr 
                                    key={client.id} 
                                    onClick={() => setSelectedClient(client)}
                                    className="hover:bg-onyx-800 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img src={client.avatar} className="w-8 h-8 rounded-full mr-3 border border-onyx-700" alt="" />
                                            <span className="font-medium text-white group-hover:text-accent-400 transition-colors">{client.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-onyx-300">
                                        <div className="flex items-center">
                                            <Building size={14} className="mr-2 text-onyx-500" />
                                            {client.company}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-0.5 text-xs rounded border ${
                                            client.status === ClientStatus.ACTIVE ? 'border-green-900 text-green-400 bg-green-900/10' : 
                                            client.status === ClientStatus.PROSPECTIVE ? 'border-blue-900 text-blue-400 bg-blue-900/10' :
                                            'border-onyx-700 text-onyx-500'
                                        }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex text-yellow-500">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill={s <= client.rating ? 'currentColor' : 'none'} className={s <= client.rating ? '' : 'text-onyx-700'} />)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-onyx-300 font-mono">{getClientProjectCount(client.id)}</td>
                                    <td className="px-6 py-4 text-white font-mono">${client.totalRevenue.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button 
                                          onClick={(e) => toggleMenu(e, client.id)}
                                          className="text-onyx-500 hover:text-white p-2 hover:bg-onyx-700 rounded transition-colors"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                        {menuOpenId === client.id && (
                                           <div className="absolute top-8 right-8 w-32 bg-onyx-950 border border-onyx-800 rounded-lg shadow-xl z-20 overflow-hidden animate-fadeIn">
                                               <button className="w-full text-left px-4 py-2 text-xs text-white hover:bg-onyx-900 flex items-center">
                                                   <Edit size={12} className="mr-2" /> Edit
                                               </button>
                                               <button 
                                                  onClick={(e) => { e.stopPropagation(); onDeleteClient(client.id); }}
                                                  className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-onyx-900 flex items-center"
                                               >
                                                   <Trash2 size={12} className="mr-2" /> Delete
                                               </button>
                                           </div>
                                       )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                   </table>
               </div>
           )}
       </div>

       <AddClientModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={onAddClient} 
       />
    </div>
  );
};
