
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import NoteForm from '@/components/NoteForm';
import { useNotesManager } from '@/hooks/useNotesManager';
import { Note } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = useNotesManager();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const { toast } = useToast();

  const truncateText = (text: string, maxLength: number = 40) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleAddNote = (noteData: any) => {
    addNote(noteData);
    setIsFormOpen(false);
    toast({
      title: "Anotação adicionada",
      description: "A anotação foi adicionada com sucesso.",
    });
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleUpdateNote = (noteData: any) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
      setEditingNote(null);
      toast({
        title: "Anotação atualizada",
        description: "A anotação foi atualizada com sucesso.",
      });
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    setDeletingNoteId(null);
    toast({
      title: "Anotação excluída",
      description: "A anotação foi excluída com sucesso.",
    });
  };

  const getOwnerColor = (owner: string) => {
    return owner === 'Thiago' ? 'text-blue-300' : 'text-purple-300';
  };

  return (
    <div className="min-h-screen w-full relative">
      <Header />
      
      <main className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Anotações
                </h2>
                <p className="text-blue-200/70">
                  Organize suas anotações e lembretes importantes
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="glass-button px-6 py-3 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus size={18} className="text-blue-300" />
                <span className="text-white font-medium">Nova Anotação</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="glass rounded-xl p-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Assunto */}
                    <div className="min-w-0 flex-1">
                      <span className="text-white font-medium text-sm block truncate">
                        {truncateText(note.subject, 50)}
                      </span>
                    </div>

                    {/* Data de prioridade */}
                    <div className="min-w-0 w-28">
                      <span className="text-blue-300 text-sm">
                        {note.priorityDate.toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    {/* Responsável */}
                    <div className="min-w-0 w-20">
                      <span className={`text-sm font-medium ${getOwnerColor(note.owner)}`}>
                        {note.owner}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="glass-button p-2 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
                      title="Editar anotação"
                    >
                      <Edit size={14} className="text-blue-300" />
                    </button>
                    <button
                      onClick={() => setDeletingNoteId(note.id)}
                      className="glass-button p-2 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                      title="Excluir anotação"
                    >
                      <Trash2 size={14} className="text-red-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {notes.length === 0 && (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-blue-200/70">Nenhuma anotação cadastrada</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de criação */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="glass-popup border-blue-400/40">
          <DialogHeader>
            <DialogTitle className="text-white">Nova Anotação</DialogTitle>
          </DialogHeader>
          <NoteForm
            onSubmit={handleAddNote}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent className="glass-popup border-blue-400/40">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Anotação</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <NoteForm
              onSubmit={handleUpdateNote}
              onCancel={() => setEditingNote(null)}
              initialData={{
                subject: editingNote.subject,
                priorityDate: editingNote.priorityDate,
                owner: editingNote.owner
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deletingNoteId} onOpenChange={() => setDeletingNoteId(null)}>
        <AlertDialogContent className="glass-popup border-blue-400/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-blue-200/70">
              Tem certeza que deseja excluir esta anotação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass-button">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingNoteId && handleDeleteNote(deletingNoteId)}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notes;
