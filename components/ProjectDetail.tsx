import React, { useState, useEffect } from 'react';
import { Project, FolderNode, ProjectStatus } from '../types';
import { 
  Folder, File, Clock, CheckCircle, MoreVertical, 
  ChevronRight, ChevronDown, Play, Square, Download, Share2
} from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onUpdateStatus: (id: string, status: ProjectStatus) => void;
}

const FileTreeItem: React.FC<{ node: FolderNode; depth?: number }> = ({ node, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    if (node.type === 'folder') setIsOpen(!isOpen);
  };

  return (
    <div>
      <div 
        className={`flex items-center py-2 px-2 hover:bg-onyx-800 cursor-pointer rounded transition-colors text-sm`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={toggleOpen}
      >
        <span className="mr-2 text-onyx-400">
            {node.type === 'folder' ? (
                isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : <span className="w-[14px]" />}
        </span>
        <span className={`mr-2 ${node.type === 'folder' ? 'text-accent-500' : 'text-onyx-400'}`}>
          {node.type === 'folder' ? <Folder size={16} fill="currentColor" fillOpacity={0.2} /> : <File size={16} />}
        </span>
        <span className="text-gray-300">{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'overview' | 'time'>('files');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(project.timeSpentSeconds);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col h-full bg-onyx-950 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-onyx-800 p-6 flex justify-between items-start">
        <div>
          <button onClick={onBack} className="text-onyx-400 hover:text-white mb-4 flex items-center text-sm">
            <ChevronRight className="rotate-180 mr-1" size={16} /> Back to Projects
          </button>
          <div className="flex items-center space-x-4">
             <img src={project.thumbnail} className="w-16 h-16 rounded-lg object-cover border border-onyx-800" alt="Thumbnail" />
             <div>
                <h1 className="text-3xl font-bold text-white mb-1">{project.name}</h1>
                <div className="flex items-center text-onyx-400 text-sm space-x-4">
                    <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-accent-500 mr-2"></span>{project.client.name}</span>
                    <span>•</span>
                    <span>Due: {project.deadline}</span>
                </div>
             </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
             <div className="flex flex-col items-end mr-4">
                <span className="text-xs text-onyx-400 uppercase tracking-wider mb-1">Status</span>
                <select 
                    value={project.status}
                    onChange={(e) => onUpdateStatus(project.id, e.target.value as ProjectStatus)}
                    className="bg-onyx-900 border border-onyx-800 text-white text-sm rounded px-3 py-1 focus:outline-none focus:border-accent-500"
                >
                    {Object.values(ProjectStatus).map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
             </div>
             <button className="p-2 hover:bg-onyx-800 rounded-lg text-onyx-400 hover:text-white transition">
                <Share2 size={20} />
             </button>
             <button className="p-2 hover:bg-onyx-800 rounded-lg text-onyx-400 hover:text-white transition">
                <MoreVertical size={20} />
             </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-onyx-800 px-6 space-x-8">
        {['files', 'overview', 'time'].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors capitalize ${
                    activeTab === tab 
                    ? 'border-accent-500 text-white' 
                    : 'border-transparent text-onyx-400 hover:text-white'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'files' && (
            <div className="bg-onyx-900 rounded-xl border border-onyx-800 overflow-hidden">
                <div className="p-4 bg-onyx-900 border-b border-onyx-800 flex justify-between items-center">
                    <h3 className="text-white font-semibold">Project Files</h3>
                    <div className="flex space-x-2">
                         <button className="px-3 py-1.5 text-xs bg-onyx-800 text-white rounded hover:bg-onyx-700 transition flex items-center">
                            <Download size={12} className="mr-2" /> Export ZIP
                         </button>
                         <button className="px-3 py-1.5 text-xs bg-accent-600 text-white rounded hover:bg-accent-500 transition">
                            Open in Finder
                         </button>
                    </div>
                </div>
                <div className="p-2">
                    {project.folderStructure && project.folderStructure.length > 0 ? (
                        project.folderStructure.map(node => (
                            <FileTreeItem key={node.id} node={node} />
                        ))
                    ) : (
                        <div className="p-8 text-center text-onyx-500 text-sm">
                            <Folder size={32} className="mx-auto mb-2 opacity-20" />
                            No folder structure defined for this project.
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
                        <p className="text-onyx-400 leading-relaxed">
                            Full brand identity package for {project.client.company}. Includes logo design (primary, secondary, marks), typography selection, color palette definition, and brand guidelines PDF. 
                        </p>
                    </div>
                    <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Milestones</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Initial Discovery', done: true },
                                { label: 'Concept Presentation', done: true },
                                { label: 'Revisions Round 1', done: false },
                                { label: 'Final Delivery', done: false }
                            ].map((m, i) => (
                                <div key={i} className="flex items-center">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${m.done ? 'bg-green-900 text-green-400' : 'bg-onyx-800 text-onyx-600'}`}>
                                        <CheckCircle size={12} />
                                    </div>
                                    <span className={m.done ? 'text-onyx-100 line-through opacity-50' : 'text-white'}>{m.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-onyx-900 p-6 rounded-xl border border-onyx-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Client Info</h3>
                        <div className="flex items-center mb-4">
                            <img src={project.client.avatar} className="w-10 h-10 rounded-full mr-3" alt="Client" />
                            <div>
                                <p className="text-white font-medium">{project.client.name}</p>
                                <p className="text-xs text-onyx-400">{project.client.company}</p>
                            </div>
                        </div>
                        <div className="text-sm text-onyx-400 space-y-2">
                             <p>Email: {project.client.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'time' && (
             <div className="flex flex-col items-center justify-center h-full pb-20">
                <div className="bg-onyx-900 p-10 rounded-2xl border border-onyx-800 text-center shadow-2xl">
                    <h3 className="text-onyx-400 mb-2 uppercase tracking-widest text-xs font-semibold">Total Time Tracked</h3>
                    <div className="text-6xl font-mono text-white mb-8 font-light tabular-nums">
                        {formatTime(elapsed)}
                    </div>
                    <button 
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isTimerRunning 
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
                            : 'bg-accent-600 text-white hover:bg-accent-500 shadow-[0_0_30px_rgba(79,70,229,0.3)]'
                        }`}
                    >
                        {isTimerRunning ? <Square fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
                    </button>
                    <p className="mt-6 text-onyx-400 text-sm">
                        {isTimerRunning ? 'Tracking billable hours...' : 'Timer paused'}
                    </p>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};