
import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

interface SummaryIndicatorsProps {
  totalEvents: number;
  pendingDemands: number;
  completedDemands: number;
  archivedEvents: number;
}

const SummaryIndicators: React.FC<SummaryIndicatorsProps> = ({
  totalEvents,
  pendingDemands,
  completedDemands
}) => {
  return (
    <div className="absolute top-20 right-4 z-40">
      <div className="flex items-center space-x-4 glass-card rounded-lg px-3 py-2">
        <div className="flex items-center space-x-1">
          <Calendar size={14} className="text-blue-300" />
          <span className="text-xs text-blue-200/70">Eventos:</span>
          <span className="text-sm font-bold text-white">{totalEvents}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Clock size={14} className="text-orange-300" />
          <span className="text-xs text-blue-200/70">Pendentes:</span>
          <span className="text-sm font-bold text-white">{pendingDemands}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <CheckCircle size={14} className="text-green-300" />
          <span className="text-xs text-blue-200/70">Concluídas:</span>
          <span className="text-sm font-bold text-white">{completedDemands}</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryIndicators;
