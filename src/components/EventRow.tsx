
import React, { useState, useRef } from 'react';
import { Plus, MoreVertical, Edit, Archive, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event, Demand } from '@/types';
import DemandCard from './DemandCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EventRowProps {
  event: Event;
  demands: Demand[];
  onAddDemand: (eventId: string) => void;
  onEditEvent: (event: Event) => void;
  onArchiveEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onEditDemand: (demand: Demand) => void;
  onCompleteDemand: (id: string) => void;
  onDeleteDemand: (id: string) => void;
}

const EventRow: React.FC<EventRowProps> = ({
  event,
  demands,
  onAddDemand,
  onEditEvent,
  onArchiveEvent,
  onDeleteEvent,
  onEditDemand,
  onCompleteDemand,
  onDeleteDemand
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 250;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = demands.length > 3;

  // Ordenar demandas por data (mais recentes primeiro)
  const sortedDemands = [...demands].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="w-full glass rounded-xl p-4 mb-4 animate-slide-in">
      <div className="flex items-center space-x-4">
        {/* Event Info */}
        <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
          <div className="flex items-center space-x-1">
            <div className="w-12 h-12 glass-card rounded-lg flex items-center justify-center overflow-hidden">
              {event.logo ? (
                <img src={event.logo} alt={event.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-teal-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-teal-300 font-bold text-sm">
                    {event.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="glass-button p-1 rounded-lg hover:bg-white/20 transition-all">
                  <MoreVertical size={14} className="text-teal-300" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="glass-popup border-teal-400/40 shadow-2xl backdrop-blur-xl"
                align="start"
                sideOffset={5}
              >
                <DropdownMenuItem 
                  onClick={() => onEditEvent(event)}
                  className="text-white hover:bg-white/10 cursor-pointer flex items-center space-x-2"
                >
                  <Edit size={14} />
                  <span>Editar evento</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onArchiveEvent(event.id)}
                  className="text-white hover:bg-white/10 cursor-pointer flex items-center space-x-2"
                >
                  <Archive size={14} />
                  <span>Arquivar evento</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteEvent(event.id)}
                  className="text-red-300 hover:bg-red-500/10 cursor-pointer flex items-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Excluir permanentemente</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="min-w-0" style={{ width: '80px' }}>
            <h3 className="text-white font-medium truncate">{event.name}</h3>
            <p className="text-teal-200/70 text-sm">
              {event.date.toLocaleDateString('pt-BR')}
            </p>
          </div>

          <button
            onClick={() => onAddDemand(event.id)}
            className="glass-button p-2 rounded-lg hover:bg-teal-500/30 transition-all flex-shrink-0"
          >
            <Plus size={16} className="text-teal-300" />
          </button>
        </div>

        {/* Navigation Arrows and Demands */}
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <button
            onClick={() => scroll('left')}
            className={`glass-button p-2 rounded-lg transition-all flex-shrink-0 ${
              canScrollLeft ? 'hover:bg-teal-500/30' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={16} className="text-teal-300" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex space-x-3 overflow-hidden scroll-hidden flex-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            {sortedDemands.map((demand) => (
              <DemandCard
                key={demand.id}
                demand={demand}
                onEdit={onEditDemand}
                onDelete={onDeleteDemand}
                onComplete={onCompleteDemand}
              />
            ))}
            
            {sortedDemands.length === 0 && (
              <div className="w-[230px] h-[90px] glass-card rounded-lg flex items-center justify-center flex-shrink-0">
                <p className="text-teal-200/70 text-sm">Nenhuma demanda</p>
              </div>
            )}
          </div>

          <button
            onClick={() => scroll('right')}
            className={`glass-button p-2 rounded-lg transition-all flex-shrink-0 ${
              canScrollRight ? 'hover:bg-teal-500/30' : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight size={16} className="text-teal-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRow;
