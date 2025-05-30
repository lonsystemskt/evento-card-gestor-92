
import React from 'react';
import { Calendar, Clock, CheckCircle, Archive } from 'lucide-react';

interface SummaryIndicatorsProps {
  totalEvents: number;
  pendingDemands: number;
  completedDemands: number;
  archivedEvents: number;
}

const SummaryIndicators: React.FC<SummaryIndicatorsProps> = ({
  totalEvents,
  pendingDemands,
  completedDemands,
  archivedEvents
}) => {
  return (
    <div className="w-full px-4 mt-6">
      <div className="glass rounded-xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 glass-card rounded-lg">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar size={20} className="text-blue-300" />
            </div>
            <div>
              <p className="text-xs text-blue-200/70">Eventos</p>
              <p className="text-lg font-bold text-white">{totalEvents}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 glass-card rounded-lg">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Clock size={20} className="text-orange-300" />
            </div>
            <div>
              <p className="text-xs text-blue-200/70">Por Fazer</p>
              <p className="text-lg font-bold text-white">{pendingDemands}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 glass-card rounded-lg">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle size={20} className="text-green-300" />
            </div>
            <div>
              <p className="text-xs text-blue-200/70">Concluídas</p>
              <p className="text-lg font-bold text-white">{completedDemands}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 glass-card rounded-lg">
            <div className="p-2 bg-gray-500/20 rounded-lg">
              <Archive size={20} className="text-gray-300" />
            </div>
            <div>
              <p className="text-xs text-blue-200/70">Arquivados</p>
              <p className="text-lg font-bold text-white">{archivedEvents}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryIndicators;
