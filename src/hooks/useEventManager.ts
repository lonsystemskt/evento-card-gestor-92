
import { useState, useEffect, useCallback } from 'react';
import { Event, Demand } from '@/types';
import { compareDatesIgnoreTime, getTodayInBrazil } from '@/utils/dateUtils';

// Chaves do localStorage
const EVENTS_KEY = 'lon-events-v2';
const DEMANDS_KEY = 'lon-demands-v2';
const SYNC_INTERVAL = 5000; // 5 segundos

export const useEventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Função para carregar dados do localStorage
  const loadFromStorage = useCallback(() => {
    console.log('🔄 Carregando dados do localStorage...');
    
    try {
      const savedEvents = localStorage.getItem(EVENTS_KEY);
      const savedDemands = localStorage.getItem(DEMANDS_KEY);
      
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt),
          isArchived: Boolean(event.isArchived),
          isPriority: Boolean(event.isPriority)
        }));
        console.log('📅 Eventos carregados:', parsedEvents.length);
        setEvents(parsedEvents);
      } else {
        setEvents([]);
      }
      
      if (savedDemands) {
        const parsedDemands = JSON.parse(savedDemands).map((demand: any) => ({
          ...demand,
          date: new Date(demand.date),
          createdAt: new Date(demand.createdAt),
          isCompleted: Boolean(demand.isCompleted),
          isArchived: Boolean(demand.isArchived)
        }));
        console.log('📋 Demandas carregadas:', parsedDemands.length);
        setDemands(parsedDemands);
      } else {
        setDemands([]);
      }
      
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setEvents([]);
      setDemands([]);
    }
  }, []);

  // Função para salvar dados no localStorage
  const saveToStorage = useCallback((newEvents: Event[], newDemands: Demand[]) => {
    if (!isLoaded) return;
    
    console.log('💾 Salvando dados no localStorage...');
    console.log('📅 Eventos a salvar:', newEvents.length);
    console.log('📋 Demandas a salvar:', newDemands.length);
    
    localStorage.setItem(EVENTS_KEY, JSON.stringify(newEvents));
    localStorage.setItem(DEMANDS_KEY, JSON.stringify(newDemands));
    setLastUpdate(Date.now());
  }, [isLoaded]);

  // Carregamento inicial
  useEffect(() => {
    loadFromStorage();
    setIsLoaded(true);
  }, [loadFromStorage]);

  // Sincronização automática a cada 5 segundos
  useEffect(() => {
    if (!isLoaded) return;

    const syncInterval = setInterval(() => {
      console.log('🔄 Sincronização automática - verificando atualizações...');
      
      const savedEvents = localStorage.getItem(EVENTS_KEY);
      const savedDemands = localStorage.getItem(DEMANDS_KEY);
      
      if (savedEvents && savedDemands) {
        try {
          const currentEvents = JSON.parse(savedEvents);
          const currentDemands = JSON.parse(savedDemands);
          
          // Verificar se há mudanças
          if (JSON.stringify(currentEvents) !== JSON.stringify(events) || 
              JSON.stringify(currentDemands) !== JSON.stringify(demands)) {
            console.log('🔄 Detectadas mudanças - atualizando estado...');
            loadFromStorage();
          }
        } catch (error) {
          console.error('❌ Erro na sincronização:', error);
        }
      }
    }, SYNC_INTERVAL);

    return () => clearInterval(syncInterval);
  }, [isLoaded, events, demands, loadFromStorage]);

  // Salvar eventos quando alterados
  useEffect(() => {
    if (isLoaded && events.length >= 0) {
      saveToStorage(events, demands);
    }
  }, [events, demands, saveToStorage, isLoaded]);

  const addEvent = useCallback((eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isPriority: false,
      isArchived: false
    };
    
    console.log('➕ Adicionando novo evento:', newEvent.name);
    setEvents(prev => {
      const updated = [...prev, newEvent];
      return updated;
    });
    
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    console.log('✏️ Atualizando evento:', id, updates);
    setEvents(prev => {
      const updated = prev.map(event => 
        event.id === id ? { ...event, ...updates } : event
      );
      return updated;
    });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    console.log('🗑️ Deletando evento:', id);
    setEvents(prev => prev.filter(event => event.id !== id));
    setDemands(prev => prev.filter(demand => demand.eventId !== id));
  }, []);

  const toggleEventPriority = useCallback((id: string) => {
    console.log('⭐ Alternando prioridade do evento:', id);
    setEvents(prev => prev.map(event => {
      if (event.id === id) {
        if (event.isPriority) {
          return { ...event, isPriority: false, priorityOrder: undefined };
        } else {
          const maxPriorityOrder = Math.max(
            ...prev.filter(e => e.isPriority).map(e => e.priorityOrder || 0),
            0
          );
          return { 
            ...event, 
            isPriority: true, 
            priorityOrder: maxPriorityOrder + 1 
          };
        }
      }
      return event;
    }));
  }, []);

  const addDemand = useCallback((demandData: Omit<Demand, 'id' | 'createdAt'>) => {
    const newDemand: Demand = {
      ...demandData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isCompleted: false,
      isArchived: false
    };
    
    console.log('➕ Adicionando nova demanda:', newDemand.title);
    setDemands(prev => {
      const updated = [...prev, newDemand];
      return updated;
    });
    
    return newDemand;
  }, []);

  const updateDemand = useCallback((id: string, updates: Partial<Demand>) => {
    console.log('✏️ Atualizando demanda:', id, updates);
    setDemands(prev => {
      const updated = prev.map(demand => 
        demand.id === id ? { ...demand, ...updates } : demand
      );
      return updated;
    });
  }, []);

  const deleteDemand = useCallback((id: string) => {
    console.log('🗑️ Deletando demanda:', id);
    setDemands(prev => prev.filter(demand => demand.id !== id));
  }, []);

  const getActiveEvents = useCallback(() => {
    const activeEvents = events.filter(event => !event.isArchived);
    
    const priorityEvents = activeEvents
      .filter(event => event.isPriority)
      .sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0));
    
    const normalEvents = activeEvents
      .filter(event => !event.isPriority)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return [...priorityEvents, ...normalEvents];
  }, [events]);

  const getArchivedEvents = useCallback(() => {
    return events.filter(event => event.isArchived);
  }, [events]);
  
  const getActiveDemands = useCallback((eventId?: string) => {
    const activeDemands = demands.filter(demand => {
      const isActive = !demand.isCompleted && !demand.isArchived;
      const matchesEvent = eventId ? demand.eventId === eventId : true;
      return isActive && matchesEvent;
    });

    return activeDemands.sort((a, b) => {
      const getUrgencyScore = (demand: Demand) => {
        const today = getTodayInBrazil();
        const diffDays = compareDatesIgnoreTime(demand.date, today);
        
        if (diffDays < 0) return 3; // Atrasadas
        if (diffDays <= 3) return 2; // Urgentes
        return 1; // Futuras
      };

      const scoreA = getUrgencyScore(a);
      const scoreB = getUrgencyScore(b);
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      
      return a.date.getTime() - b.date.getTime();
    });
  }, [demands]);
    
  const getCompletedDemands = useCallback((eventId?: string) => {
    const completed = demands.filter(demand => {
      const isCompleted = demand.isCompleted === true;
      const isNotArchived = !demand.isArchived;
      const matchesEvent = eventId ? demand.eventId === eventId : true;
      
      return isCompleted && isNotArchived && matchesEvent;
    });
    
    return completed.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [demands]);

  const getAllEvents = useCallback(() => {
    return events;
  }, [events]);

  return {
    events,
    demands,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleEventPriority,
    addDemand,
    updateDemand,
    deleteDemand,
    getActiveEvents,
    getArchivedEvents,
    getActiveDemands,
    getCompletedDemands,
    getAllEvents,
    lastUpdate
  };
};
