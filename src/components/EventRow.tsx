
import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical, Edit, Archive, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event, Demand } from '@/types';
import DemandCard from './DemandCard';

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
  const [showMenu, setShowMenu] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Calcular posição do menu quando abrir
  useEffect(() => {
    if (showMenu && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 192; // w-48 = 192px
      const menuHeight = 120; // altura aproximada do menu
      
      // Posicionar ligeiramente acima e à direita do botão
      let top = triggerRect.top - menuHeight - 8;
      let left = triggerRect.left;
      
      // Verificar se o menu sairia da tela e ajustar
      if (top < 8) {
        top = triggerRect.bottom + 8; // Mostrar abaixo se não couber acima
      }
      
      if (left + menuWidth > window.innerWidth - 8) {
        left = window.innerWidth - menuWidth - 8; // Ajustar para não sair da lateral direita
      }
      
      if (left < 8) {
        left = 8; // Não deixar sair da lateral esquerda
      }
      
      setMenuPosition({ top, left });
    }
  }, [showMenu]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

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
            
            <div className="relative">
              <button
                ref={triggerRef}
                onClick={() => setShowMenu(!showMenu)}
                className="glass-button p-1 rounded-lg hover:bg-white/20 transition-all"
              >
                <MoreVertical size={14} className="text-teal-300" />
              </button>

              {showMenu && (
                <>
                  {/* Overlay para capturar cliques fora */}
                  <div className="fixed inset-0 z-[9998]" onClick={() => setShowMenu(false)} />
                  
                  {/* Menu dropdown */}
                  <div 
                    ref={menuRef}
                    className="fixed bg-slate-900/98 backdrop-blur-2xl border border-teal-400/40 rounded-lg py-2 w-48 shadow-2xl z-[9999]"
                    style={{
                      top: `${menuPosition.top}px`,
                      left: `${menuPosition.left}px`,
                    }}
                  >
                    <button
                      onClick={() => {
                        onEditEvent(event);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                      <Edit size={14} />
                      <span>Editar evento</span>
                    </button>
                    <button
                      onClick={() => {
                        onArchiveEvent(event.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                      <Archive size={14} />
                      <span>Arquivar evento</span>
                    </button>
                    <button
                      onClick={() => {
                        onDeleteEvent(event.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-red-300 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 size={14} />
                      <span>Excluir permanentemente</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="min-w-0" style={{ width: '170px' }}>
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
