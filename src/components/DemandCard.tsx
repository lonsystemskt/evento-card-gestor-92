
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
    // Usar apenas a data sem horário para comparação
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const demandDate = new Date(demand.date.getFullYear(), demand.date.getMonth(), demand.date.getDate());
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

  const truncateText = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Completing demand:', demand.id);
    onComplete(demand.id);
  };

  const status = getStatus();

  return (
    <div className="w-[240px] lg:w-[260px] h-[100px] glass-card rounded-lg p-3 flex-shrink-0 relative hover:bg-white/10 transition-all duration-200">
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(status)}`}></div>
            <h4 className="text-sm font-medium text-white truncate" title={demand.title}>
              {truncateText(demand.title, 25)}
            </h4>
          </div>
          
          <p className="text-xs text-blue-200/70 mb-2 line-clamp-2 leading-tight" title={demand.subject}>
            {demand.subject}
          </p>
          
          <p className="text-xs text-blue-300 font-medium">
            {demand.date.toLocaleDateString('pt-BR')}
          </p>
        </div>
        
        <div className="flex flex-col space-y-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(demand);
            }}
            className="p-1.5 hover:bg-blue-500/20 rounded transition-colors"
            title="Editar demanda"
          >
            <Edit size={12} className="text-blue-300" />
          </button>
          
          <button
            onClick={handleComplete}
            className="p-1.5 hover:bg-green-500/20 rounded transition-colors"
            title="Marcar como concluída"
          >
            <CheckCircle size={12} className="text-green-300" />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(demand.id);
            }}
            className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
            title="Excluir demanda"
          >
            <Trash2 size={12} className="text-red-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemandCard;
