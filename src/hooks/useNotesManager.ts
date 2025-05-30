
import { useState, useEffect } from 'react';
import { Note } from '@/types';

export const useNotesManager = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('lon-notes');
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        priorityDate: new Date(note.priorityDate),
        createdAt: new Date(note.createdAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('lon-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setNotes(prev => [...prev, newNote]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Sort notes by priority date (closest first)
  const sortedNotes = [...notes].sort((a, b) => 
    a.priorityDate.getTime() - b.priorityDate.getTime()
  );

  return {
    notes: sortedNotes,
    addNote,
    updateNote,
    deleteNote
  };
};
