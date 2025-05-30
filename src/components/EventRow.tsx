
import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical, Edit, Archive, Trash2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
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
  onTogglePriority: (id: string) => void;
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
  onTogglePriority,
  onEditDemand,
  onCompleteDemand,
  onDeleteDemand
}) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStartX, setScrollStartX] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    updateScrollButtons();
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      const resizeObserver = new ResizeObserver(updateScrollButtons);
      resizeObserver.observe(container);
      
      return () => {
        container.removeEventListener('scroll', updateScrollButtons);
        resizeObserver.disconnect();
      };
    }
  }, [demands]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 280;
    const currentScroll = container.scrollLeft;
    const newPosition = direction === 'left' 
      ? Math.max(0, currentScroll - scrollAmount)
      : currentScroll + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };

  const isNearActionIcons = (clientX: number, clientY: number) => {
    const container = scrollContainerRef.current;
    if (!container) return false;

    const actionButtons = container.querySelectorAll('button');
    const excludeZone = 8;

    for (const button of actionButtons) {
      const rect = button.getBoundingClientRect();
      
      if (
        clientX >= rect.left - excludeZone &&
        clientX <= rect.right + excludeZone &&
        clientY >= rect.top - excludeZone &&
        clientY <= rect.bottom + excludeZone
      ) {
        return true;
      }
    }

    return false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isNearActionIcons(e.clientX, e.clientY)) {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDragging(true);
    setStartX(e.clientX);
    setScrollStartX(container.scrollLeft);
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();
    const deltaX = e.clientX - startX;
    container.scrollLeft = scrollStartX - deltaX;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = 'grab';
      container.style.userSelect = '';
    }
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      const container = scrollContainerRef.current;
      if (container) {
        container.style.cursor = 'grab';
        container.style.userSelect = '';
      }
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    
    if (isNearActionIcons(touch.clientX, touch.clientY)) {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDragging(true);
    setStartX(touch.clientX);
    setScrollStartX(container.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    container.scrollLeft = scrollStartX - deltaX;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const getDemandStatus = (demand: Demand) => {
    const today = new Date();
    const demandDate = new Date(demand.date);
    const diffDays = Math.ceil((demandDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'current';
    return 'upcoming';
  };

  const sortedDemands = [...demands].sort((a, b) => {
    const statusA = getDemandStatus(a);
    const statusB = getDemandStatus(b);
    
    const statusOrder = { 'overdue': 0, 'current': 1, 'upcoming': 2 };
    
    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }
    
    return a.date.getTime() - b.date.getTime();
  });

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        const container = scrollContainerRef.current;
        if (container) {
          container.style.cursor = 'grab';
          container.style.userSelect = '';
        }
        setIsDragging(false);
      }
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const container = scrollContainerRef.current;
      if (!container) return;

      e.preventDefault();
      const deltaX = e.clientX - startX;
      container.scrollLeft = scrollStartX - deltaX;
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, startX, scrollStartX]);

  return (
    <div className="w-full glass rounded-xl p-4 mb-4 animate-slide-in relative">
      <button
        onClick={() => onTogglePriority(event.id)}
        className="absolute top-2 left-2 p-1 rounded hover:bg-yellow-500/20 transition-all duration-200 z-10"
        title={event.isPriority ? "Remover prioridade" : "Marcar como prioridade"}
      >
        <Star 
          size={10} 
          className={event.isPriority ? "text-yellow-400 fill-yellow-400" : "text-gray-400 fill-gray-400 opacity-60"} 
        />
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Event Info Section - Fixed Width for Consistency */}
        <div className="flex items-center space-x-3 min-w-0 flex-shrink-0 lg:w-64">
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
                <button className="glass-button p-1 rounded-lg hover:bg-white/20 transition-all duration-200">
                  <MoreVertical size={14} className="text-teal-300" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="glass-popup border-teal-400/40 shadow-2xl backdrop-blur-xl z-50"
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
          
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-medium truncate text-sm lg:text-base">{event.name}</h3>
            <p className="text-teal-200/70 text-xs lg:text-sm">
              {event.date.toLocaleDateString('pt-BR')}
            </p>
          </div>

          <button
            onClick={() => onAddDemand(event.id)}
            className="glass-button p-2 rounded-lg hover:bg-teal-500/30 transition-all duration-200 flex-shrink-0"
          >
            <Plus size={16} className="text-teal-300" />
          </button>
        </div>

        {/* Demands Section - Scrollable */}
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <button
            onClick={() => scroll('left')}
            className={`glass-button p-2 rounded-lg transition-all duration-300 flex-shrink-0 transform hover:scale-105 ${
              canScrollLeft 
                ? 'hover:bg-teal-500/30 opacity-100' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft size={16} className="text-teal-300" />
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex space-x-3 overflow-hidden scroll-hidden flex-1 select-none"
            style={{ 
              scrollBehavior: isDragging ? 'auto' : 'smooth',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleContainerClick}
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
            className={`glass-button p-2 rounded-lg transition-all duration-300 flex-shrink-0 transform hover:scale-105 ${
              canScrollRight 
                ? 'hover:bg-teal-500/30 opacity-100' 
                : 'opacity-30 cursor-not-allowed'
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
