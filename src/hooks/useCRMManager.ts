
import { useState, useEffect } from 'react';
import { CRMContact } from '@/types';

export const useCRMManager = () => {
  const [contacts, setContacts] = useState<CRMContact[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem('lon-crm-contacts');
    
    if (savedContacts) {
      const parsedContacts = JSON.parse(savedContacts).map((contact: any) => ({
        ...contact,
        priorityDate: new Date(contact.priorityDate),
        createdAt: new Date(contact.createdAt)
      }));
      setContacts(parsedContacts);
    }
  }, []);

  // Save contacts to localStorage
  useEffect(() => {
    localStorage.setItem('lon-crm-contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (contactData: Omit<CRMContact, 'id' | 'createdAt'>) => {
    const newContact: CRMContact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setContacts(prev => [...prev, newContact]);
    return newContact;
  };

  const updateContact = (id: string, updates: Partial<CRMContact>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    ));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  // Sort contacts by priority date (closest first)
  const sortedContacts = [...contacts].sort((a, b) => 
    a.priorityDate.getTime() - b.priorityDate.getTime()
  );

  return {
    contacts: sortedContacts,
    addContact,
    updateContact,
    deleteContact
  };
};
