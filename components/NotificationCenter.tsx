
import React, { useState } from 'react';
import { 
  X, Check, Trash2, Filter, Bell, Clock, AlertTriangle, 
  Info, CheckCircle, Database, User 
} from 'lucide-react';
import { Notification } from '../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  notifications, onClose, onMarkRead, onMarkAllRead, onClearAll 
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.priority === 'critical';
    return true;
  });

  const getIcon = (category: string, priority: string) => {
    if (priority === 'critical') return <AlertTriangle size={16} className="text-red-500" />;
    switch (category) {
      case 'project': return <CheckCircle size={16} className="text-accent-500" />;
      case 'system': return <Database size={16} className="text-orange-500" />;
      case 'client': return <User size={16} className="text-green-500" />;
      case 'time': return <Clock size={16} className="text-blue-500" />;
      default: return <Info size={16} className="text-onyx-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-4 border-l-red-500 bg-red-500/5';
      case 'high': return 'border-l-4 border-l-orange-500 bg-orange-500/5';
      default: return 'border-l-4 border-l-onyx-700 hover:bg-onyx-800';
    }
  };

  return (
    <div className="absolute top-16 right-8 w-96 bg-onyx-900 border border-onyx-800 rounded-xl shadow-2xl z-50 flex flex-col max-h-[80vh] animate-fadeIn origin-top-right">
      {/* Header */}
      <div className="p-4 border-b border-onyx-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Bell size={18} className="text-white" />
            <h3 className="font-semibold text-white">Notifications</h3>
            <span className="bg-accent-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {notifications.filter(n => !n.read).length}
            </span>
        </div>
        <div className="flex gap-2">
            <button onClick={onMarkAllRead} className="text-xs text-accent-500 hover:text-accent-400 transition-colors" title="Mark all as read">
                Mark all read
            </button>
            <div className="w-px h-4 bg-onyx-700 self-center mx-1"></div>
            <button onClick={onClose} className="text-onyx-400 hover:text-white transition-colors">
                <X size={18} />
            </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
          <div className="flex p-2 gap-2 border-b border-onyx-800 overflow-x-auto animate-fadeIn">
            {[
                { id: 'all', label: 'All' }, 
                { id: 'unread', label: 'Unread' },
                { id: 'critical', label: 'Critical' }
            ].map(f => (
                <button
                    key={f.id}
                    onClick={() => setFilter(f.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        filter === f.id ? 'bg-onyx-800 text-white' : 'text-onyx-400 hover:text-onyx-200'
                    }`}
                >
                    {f.label}
                </button>
            ))}
          </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-onyx-500">
                <Bell size={32} className="mb-3 opacity-20" />
                <p className="text-sm">No notifications</p>
            </div>
        ) : (
            <div className="divide-y divide-onyx-800">
                {filteredNotifications.map(n => (
                    <div 
                        key={n.id} 
                        className={`p-4 transition-colors relative group ${getPriorityColor(n.priority)} ${n.read ? 'opacity-60' : 'opacity-100'}`}
                    >
                        <div className="flex gap-3">
                            <div className="mt-0.5 flex-shrink-0">
                                {getIcon(n.category, n.priority)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm font-medium text-white truncate pr-2">{n.title}</p>
                                    <span className="text-[10px] text-onyx-500 whitespace-nowrap">{n.timestamp}</span>
                                </div>
                                <p className="text-xs text-onyx-400 leading-relaxed mb-2">{n.message}</p>
                                {!n.read && (
                                    <button 
                                        onClick={() => onMarkRead(n.id)}
                                        className="text-[10px] text-accent-500 hover:text-accent-400 font-medium flex items-center gap-1"
                                    >
                                        <Check size={10} /> Mark read
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-onyx-800 bg-onyx-900/50 flex justify-between items-center rounded-b-xl">
        <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`text-xs transition-colors flex items-center gap-1 ${showFilters ? 'text-white' : 'text-onyx-500 hover:text-white'}`}
        >
            <Filter size={12} /> Filter Settings
        </button>
        <button 
            onClick={onClearAll}
            className="text-xs text-onyx-500 hover:text-red-400 transition-colors flex items-center gap-1"
        >
            <Trash2 size={12} /> Clear All
        </button>
      </div>
    </div>
  );
};
