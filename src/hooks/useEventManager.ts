
import { useState, useEffect } from 'react';
import { Event, Demand } from '@/types';
import { compareDatesIgnoreTime, getTodayInBrazil } from '@/utils/dateUtils';

export const useEventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('lon-events');
    const savedDemands = localStorage.getItem('lon-demands');
    
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt),
          isArchived: Boolean(event.isArchived),
          isPriority: Boolean(event.isPriority)
        }));
        console.log('Loaded events from localStorage:', parsedEvents);
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      }
    }
    
    if (savedDemands) {
      try {
        const parsedDemands = JSON.parse(savedDemands).map((demand: any) => ({
          ...demand,
          date: new Date(demand.date),
          createdAt: new Date(demand.createdAt),
          isCompleted: Boolean(demand.isCompleted),
          isArchived: Boolean(demand.isArchived)
        }));
        console.log('Loaded demands from localStorage:', parsedDemands);
        setDemands(parsedDemands);
      } catch (error) {
        console.error('Error loading demands:', error);
        setDemands([]);
      }
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (events.length > 0 || localStorage.getItem('lon-events')) {
      console.log('Saving events to localStorage:', events);
      localStorage.setItem('lon-events', JSON.stringify(events));
    }
  }, [events]);

  // Save demands to localStorage whenever demands change
  useEffect(() => {
    if (demands.length > 0 || localStorage.getItem('lon-demands')) {
      console.log('Saving demands to localStorage:', demands);
      localStorage.setItem('lon-demands', JSON.stringify(demands));
    }
  }, [demands]);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isPriority: false,
      isArchived: false
    };
    console.log('Adding new event:', newEvent);
    setEvents(prev => {
      const updated = [...prev, newEvent];
      console.log('Updated events:', updated);
      return updated;
    });
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    console.log('Updating event:', id, updates);
    setEvents(prev => {
      const updated = prev.map(event => 
        event.id === id ? { ...event, ...updates } : event
      );
      console.log('Updated events:', updated);
      return updated;
    });
  };

  const toggleEventPriority = (id: string) => {
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
  };

  const deleteEvent = (id: string) => {
    console.log('Deleting event:', id);
    setEvents(prev => {
      const updated = prev.filter(event => event.id !== id);
      console.log('Updated events after delete:', updated);
      return updated;
    });
    setDemands(prev => {
      const updated = prev.filter(demand => demand.eventId !== id);
      console.log('Updated demands after event delete:', updated);
      return updated;
    });
  };

  const addDemand = (demandData: Omit<Demand, 'id' | 'createdAt'>) => {
    const newDemand: Demand = {
      ...demandData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isCompleted: false,
      isArchived: false
    };
    console.log('Adding new demand:', newDemand);
    setDemands(prev => {
      const updated = [...prev, newDemand];
      console.log('Updated demands:', updated);
      return updated;
    });
    return newDemand;
  };

  const updateDemand = (id: string, updates: Partial<Demand>) => {
    console.log('Updating demand:', id, updates);
    setDemands(prev => {
      const updated = prev.map(demand => 
        demand.id === id ? { ...demand, ...updates } : demand
      );
      console.log('Updated demands:', updated);
      return updated;
    });
  };

  const deleteDemand = (id: string) => {
    console.log('Deleting demand:', id);
    setDemands(prev => {
      const updated = prev.filter(demand => demand.id !== id);
      console.log('Updated demands after delete:', updated);
      return updated;
    });
  };

  const getActiveEvents = () => {
    const activeEvents = events.filter(event => !event.isArchived);
    
    const priorityEvents = activeEvents
      .filter(event => event.isPriority)
      .sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0));
    
    const normalEvents = activeEvents
      .filter(event => !event.isPriority)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return [...priorityEvents, ...normalEvents];
  };

  const getArchivedEvents = () => {
    console.log('getArchivedEvents - Total events:', events.length);
    const archived = events.filter(event => event.isArchived === true);
    console.log('getArchivedEvents - Archived events:', archived.length, archived);
    return archived;
  };
  
  const getActiveDemands = (eventId?: string) => {
    const activeDemands = demands.filter(demand => 
      !demand.isCompleted && 
      !demand.isArchived && 
      (eventId ? demand.eventId === eventId : true)
    );

    return activeDemands.sort((a, b) => {
      const getUrgencyScore = (demand: Demand) => {
        const today = getTodayInBrazil();
        const diffDays = compareDatesIgnoreTime(demand.date, today);
        
        if (diffDays < 0) return 3;
        if (diffDays <= 3) return 2;
        return 1;
      };

      const scoreA = getUrgencyScore(a);
      const scoreB = getUrgencyScore(b);
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      
      return a.date.getTime() - b.date.getTime();
    });
  };
    
  const getCompletedDemands = (eventId?: string) => {
    console.log('getCompletedDemands - Total demands:', demands.length);
    console.log('getCompletedDemands - All demands:', demands);
    
    const completed = demands.filter(demand => {
      const isCompleted = demand.isCompleted === true;
      const isNotArchived = !demand.isArchived;
      const matchesEvent = eventId ? demand.eventId === eventId : true;
      
      console.log(`Demand ${demand.id}: isCompleted=${isCompleted}, isNotArchived=${isNotArchived}, matchesEvent=${matchesEvent}`);
      
      return isCompleted && isNotArchived && matchesEvent;
    });
    
    console.log('getCompletedDemands - Completed demands:', completed.length, completed);
    return completed;
  };

  const getAllEvents = () => {
    return events;
  };

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
    getAllEvents
  };
};
