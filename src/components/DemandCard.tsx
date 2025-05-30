
import React from 'react';
import { Edit, Trash2, CheckCircle } from 'lucide-react';
import { Demand, DemandStatus } from '@/types';

interface DemandCardProps {
  demand: Demand;
  onEdit: (demand: Demand) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const DemandCard: React.FC<DemandCardProps> = ({
  demand,
  onEdit,
  onDelete,
  onComplete
}) => {
  const getStatus = (): DemandStatus => {
    const today = new Date();
    const demandDate = new Date(demand.date);
    const diffDays = Math.ceil((demandDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'current';
    return 'upcoming';
  };

  const getStatusColor = (status: DemandStatus) => {
    switch (status) {
      case 'overdue': return 'bg-red-500';
      case 'current': return 'bg-orange-500';
      case 'upcoming': return 'bg-green-500';
    }
  };

  const status = getStatus();

  return (
    <div className="w-[230px] h-[90px] glass-card rounded-lg p-3 flex-shrink-0 relative group hover:bg-white/10 transition-all duration-200">
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
            <h4 className="text-xs font-medium text-white truncate">{demand.title}</h4>
          </div>
          
          <p className="text-xs text-blue-200/70 truncate mb-1">{demand.subject}</p>
          
          <p className="text-xs text-blue-300">
            {demand.date.toLocaleDateString('pt-BR')}
          </p>
        </div>
        
        <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(demand)}
            className="p-1 hover:bg-blue-500/20 rounded transition-colors"
          >
            <Edit size={12} className="text-blue-300" />
          </button>
          
          <button
            onClick={() => onComplete(demand.id)}
            className="p-1 hover:bg-green-500/20 rounded transition-colors"
          >
            <CheckCircle size={12} className="text-green-300" />
          </button>
          
          <button
            onClick={() => onDelete(demand.id)}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
          >
            <Trash2 size={12} className="text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemandCard;
