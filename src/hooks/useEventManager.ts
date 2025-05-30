
import { useState, useEffect } from 'react';
import { Event, Demand } from '@/types';

export const useEventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('lon-events');
    const savedDemands = localStorage.getItem('lon-demands');
    
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
        ...event,
        date: new Date(event.date),
        createdAt: new Date(event.createdAt)
      }));
      setEvents(parsedEvents);
    }
    
    if (savedDemands) {
      const parsedDemands = JSON.parse(savedDemands).map((demand: any) => ({
        ...demand,
        date: new Date(demand.date),
        createdAt: new Date(demand.createdAt)
      }));
      setDemands(parsedDemands);
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('lon-events', JSON.stringify(events));
  }, [events]);

  // Save demands to localStorage
  useEffect(() => {
    localStorage.setItem('lon-demands', JSON.stringify(demands));
  }, [demands]);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setDemands(prev => prev.filter(demand => demand.eventId !== id));
  };

  const addDemand = (demandData: Omit<Demand, 'id' | 'createdAt'>) => {
    const newDemand: Demand = {
      ...demandData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setDemands(prev => [...prev, newDemand]);
    return newDemand;
  };

  const updateDemand = (id: string, updates: Partial<Demand>) => {
    setDemands(prev => prev.map(demand => 
      demand.id === id ? { ...demand, ...updates } : demand
    ));
  };

  const deleteDemand = (id: string) => {
    setDemands(prev => prev.filter(demand => demand.id !== id));
  };

  const getActiveEvents = () => events.filter(event => !event.isArchived);
  const getArchivedEvents = () => events.filter(event => event.isArchived);
  
  const getActiveDemands = (eventId?: string) => 
    demands.filter(demand => 
      !demand.isCompleted && 
      !demand.isArchived && 
      (eventId ? demand.eventId === eventId : true)
    );
    
  const getCompletedDemands = (eventId?: string) => 
    demands.filter(demand => 
      demand.isCompleted && 
      (eventId ? demand.eventId === eventId : true)
    );

  return {
    events,
    demands,
    addEvent,
    updateEvent,
    deleteEvent,
    addDemand,
    updateDemand,
    deleteDemand,
    getActiveEvents,
    getArchivedEvents,
    getActiveDemands,
    getCompletedDemands
  };
};
