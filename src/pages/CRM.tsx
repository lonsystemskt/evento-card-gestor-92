
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import CRMForm from '@/components/CRMForm';
import { useCRMManager } from '@/hooks/useCRMManager';
import { CRMContact } from '@/types';
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

const CRM = () => {
  const { contacts, addContact, updateContact, deleteContact } = useCRMManager();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<CRMContact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | null>(null);
  const { toast } = useToast();

  const truncateText = (text: string, maxLength: number = 25) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleAddContact = (contactData: any) => {
    addContact(contactData);
    setIsFormOpen(false);
    toast({
      title: "Contato adicionado",
      description: "O contato foi adicionado com sucesso.",
    });
  };

  const handleEditContact = (contact: CRMContact) => {
    setEditingContact(contact);
  };

  const handleUpdateContact = (contactData: any) => {
    if (editingContact) {
      updateContact(editingContact.id, contactData);
      setEditingContact(null);
      toast({
        title: "Contato atualizado",
        description: "O contato foi atualizado com sucesso.",
      });
    }
  };

  const handleDeleteContact = (contactId: string) => {
    deleteContact(contactId);
    setDeletingContactId(null);
    toast({
      title: "Contato excluído",
      description: "O contato foi excluído com sucesso.",
    });
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
                  CRM - Gestão de Contatos
                </h2>
                <p className="text-blue-200/70">
                  Gerencie seus contatos e leads de forma organizada
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(true)}
                className="glass-button px-6 py-3 rounded-lg hover:bg-blue-500/30 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus size={18} className="text-blue-300" />
                <span className="text-white font-medium">Novo CRM</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="glass rounded-xl p-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Nome */}
                    <div className="min-w-0 w-48">
                      <span className="text-white font-medium text-sm block truncate">
                        {truncateText(contact.name, 20)}
                      </span>
                    </div>

                    {/* E-mail */}
                    <div className="min-w-0 flex-1">
                      <span className="text-blue-200 text-sm block truncate">
                        {truncateText(contact.email, 30)}
                      </span>
                    </div>

                    {/* Telefone */}
                    <div className="min-w-0 w-32">
                      <span className="text-blue-200/70 text-sm block truncate">
                        {truncateText(contact.phone, 15)}
                      </span>
                    </div>

                    {/* Assunto */}
                    <div className="min-w-0 flex-1">
                      <span className="text-blue-200/70 text-sm block truncate">
                        {truncateText(contact.subject, 25)}
                      </span>
                    </div>

                    {/* Data de prioridade */}
                    <div className="min-w-0 w-24 text-right">
                      <span className="text-blue-300 text-xs">
                        {contact.priorityDate.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="glass-button p-2 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
                      title="Editar contato"
                    >
                      <Edit size={14} className="text-blue-300" />
                    </button>
                    <button
                      onClick={() => setDeletingContactId(contact.id)}
                      className="glass-button p-2 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                      title="Excluir contato"
                    >
                      <Trash2 size={14} className="text-red-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {contacts.length === 0 && (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-blue-200/70">Nenhum contato cadastrado</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de criação */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="glass-popup border-blue-400/40">
          <DialogHeader>
            <DialogTitle className="text-white">Novo Contato CRM</DialogTitle>
          </DialogHeader>
          <CRMForm
            onSubmit={handleAddContact}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
      <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
        <DialogContent className="glass-popup border-blue-400/40">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Contato</DialogTitle>
          </DialogHeader>
          {editingContact && (
            <CRMForm
              onSubmit={handleUpdateContact}
              onCancel={() => setEditingContact(null)}
              initialData={{
                name: editingContact.name,
                email: editingContact.email,
                phone: editingContact.phone,
                subject: editingContact.subject,
                priorityDate: editingContact.priorityDate
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deletingContactId} onOpenChange={() => setDeletingContactId(null)}>
        <AlertDialogContent className="glass-popup border-blue-400/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-blue-200/70">
              Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass-button">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingContactId && handleDeleteContact(deletingContactId)}
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

export default CRM;
