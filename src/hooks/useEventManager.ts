
import { useState, useEffect } from 'react';
import { Event, Demand } from '@/types';
import { compareDatesIgnoreTime, getTodayInBrazil } from '@/utils/dateUtils';

export const useEventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('lon-events');
    const savedDemands = localStorage.getItem('lon-demands');
    
    console.log('Loading data from localStorage...');
    
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
    
    setIsLoaded(true);
  }, []);

  // Save events to localStorage whenever events change, but only after initial load
  useEffect(() => {
    if (!isLoaded) return;
    console.log('Saving events to localStorage:', events);
    localStorage.setItem('lon-events', JSON.stringify(events));
  }, [events, isLoaded]);

  // Save demands to localStorage whenever demands change, but only after initial load
  useEffect(() => {
    if (!isLoaded) return;
    console.log('Saving demands to localStorage:', demands);
    localStorage.setItem('lon-demands', JSON.stringify(demands));
  }, [demands, isLoaded]);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isPriority: false,
      isArchived: false
    };
    console.log('Adding new event:', newEvent);
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    console.log('Updating event:', id, 'with updates:', updates);
    setEvents(prev => {
      const updated = prev.map(event => {
        if (event.id === id) {
          const updatedEvent = { ...event, ...updates };
          console.log('Event updated from:', event, 'to:', updatedEvent);
          return updatedEvent;
        }
        return event;
      });
      console.log('All events after update:', updated);
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
    setEvents(prev => prev.filter(event => event.id !== id));
    setDemands(prev => prev.filter(demand => demand.eventId !== id));
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
    setDemands(prev => [...prev, newDemand]);
    return newDemand;
  };

  const updateDemand = (id: string, updates: Partial<Demand>) => {
    console.log('Updating demand:', id, 'with updates:', updates);
    setDemands(prev => {
      const updated = prev.map(demand => {
        if (demand.id === id) {
          const updatedDemand = { ...demand, ...updates };
          console.log('Demand updated from:', demand, 'to:', updatedDemand);
          return updatedDemand;
        }
        return demand;
      });
      console.log('All demands after update:', updated);
      return updated;
    });
  };

  const deleteDemand = (id: string) => {
    console.log('Deleting demand:', id);
    setDemands(prev => prev.filter(demand => demand.id !== id));
  };

  const getActiveEvents = () => {
    console.log('Getting active events - filtering from:', events.length, 'events');
    const activeEvents = events.filter(event => {
      const isActive = !event.isArchived;
      console.log(`Event ${event.id} (${event.name}): isArchived=${event.isArchived}, isActive=${isActive}`);
      return isActive;
    });
    
    console.log('Active events found:', activeEvents.length);
    
    const priorityEvents = activeEvents
      .filter(event => event.isPriority)
      .sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0));
    
    const normalEvents = activeEvents
      .filter(event => !event.isPriority)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return [...priorityEvents, ...normalEvents];
  };

  const getArchivedEvents = () => {
    console.log('Getting archived events - filtering from:', events.length, 'events');
    const archived = events.filter(event => {
      const isArchived = event.isArchived === true;
      console.log(`Event ${event.id} (${event.name}): isArchived=${event.isArchived}, willShow=${isArchived}`);
      return isArchived;
    });
    console.log('Archived events found:', archived.length);
    return archived;
  };
  
  const getActiveDemands = (eventId?: string) => {
    console.log('Getting active demands - filtering from:', demands.length, 'demands');
    const activeDemands = demands.filter(demand => {
      const isActive = !demand.isCompleted && !demand.isArchived;
      const matchesEvent = eventId ? demand.eventId === eventId : true;
      console.log(`Demand ${demand.id} (${demand.title}): isCompleted=${demand.isCompleted}, isArchived=${demand.isArchived}, isActive=${isActive}, matchesEvent=${matchesEvent}`);
      return isActive && matchesEvent;
    });

    console.log('Active demands found:', activeDemands.length);

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
    console.log('Getting completed demands - filtering from:', demands.length, 'demands');
    const completed = demands.filter(demand => {
      const isCompleted = demand.isCompleted === true;
      const isNotArchived = !demand.isArchived;
      const matchesEvent = eventId ? demand.eventId === eventId : true;
      
      console.log(`Demand ${demand.id} (${demand.title}): isCompleted=${demand.isCompleted}, isArchived=${demand.isArchived}, isCompleted=${isCompleted}, isNotArchived=${isNotArchived}, matchesEvent=${matchesEvent}`);
      
      return isCompleted && isNotArchived && matchesEvent;
    });
    
    console.log('Completed demands found:', completed.length);
    return completed.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
