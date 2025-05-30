
import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import DemandForm from '@/components/DemandForm';
import { useEventManager } from '@/hooks/useEventManager';
import { Demand, Event } from '@/types';
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

const GeneralView = () => {
  const { 
    getActiveEvents, 
    getActiveDemands, 
    updateDemand, 
    deleteDemand 
  } = useEventManager();
  
  const [editingDemand, setEditingDemand] = useState<Demand | null>(null);
  const [deletingDemandId, setDeletingDemandId] = useState<string | null>(null);
  const { toast } = useToast();

  const events = getActiveEvents();
  const allDemands = getActiveDemands();

  const getEventById = (eventId: string): Event | undefined => {
    return events.find(event => event.id === eventId);
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleEditDemand = (demand: Demand) => {
    setEditingDemand(demand);
  };

  const handleUpdateDemand = (demandData: any) => {
    if (editingDemand) {
      updateDemand(editingDemand.id, {
        title: demandData.title,
        subject: demandData.subject,
        date: demandData.date
      });
      setEditingDemand(null);
      toast({
        title: "Demanda atualizada",
        description: "A demanda foi atualizada com sucesso.",
      });
    }
  };

  const handleDeleteDemand = (demandId: string) => {
    deleteDemand(demandId);
    setDeletingDemandId(null);
    toast({
      title: "Demanda excluída",
      description: "A demanda foi excluída com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Visão Geral - Todas as Demandas
            </h2>
            <p className="text-teal-200/70">
              Visualize todas as demandas do sistema organizadas por evento
            </p>
          </div>

          <div className="space-y-3">
            {allDemands.map((demand) => {
              const event = getEventById(demand.eventId);
              if (!event) return null;

              return (
                <div key={demand.id} className="glass rounded-lg p-4 animate-slide-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {/* Logo do evento */}
                      <div className="w-10 h-10 glass-card rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {event.logo ? (
                          <img src={event.logo} alt={event.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-teal-500/30 rounded-lg flex items-center justify-center">
                            <span className="text-teal-300 font-bold text-xs">
                              {event.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Nome do evento */}
                      <div className="min-w-0 w-32">
                        <span className="text-white font-medium text-sm block truncate">
                          {truncateText(event.name, 15)}
                        </span>
                      </div>

                      {/* Nome da demanda */}
                      <div className="min-w-0 flex-1">
                        <span className="text-teal-200 text-sm block truncate">
                          {truncateText(demand.title, 25)}
                        </span>
                      </div>

                      {/* Assunto da demanda */}
                      <div className="min-w-0 flex-1">
                        <span className="text-teal-200/70 text-sm block truncate">
                          {truncateText(demand.subject, 30)}
                        </span>
                      </div>

                      {/* Data */}
                      <div className="min-w-0 w-24 text-right">
                        <span className="text-teal-300 text-xs">
                          {demand.date.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditDemand(demand)}
                        className="glass-button p-2 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
                        title="Editar demanda"
                      >
                        <Edit size={14} className="text-blue-300" />
                      </button>
                      <button
                        onClick={() => setDeletingDemandId(demand.id)}
                        className="glass-button p-2 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                        title="Excluir demanda"
                      >
                        <Trash2 size={14} className="text-red-300" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {allDemands.length === 0 && (
              <div className="glass rounded-lg p-8 text-center">
                <p className="text-teal-200/70">Nenhuma demanda encontrada</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de edição */}
      <Dialog open={!!editingDemand} onOpenChange={() => setEditingDemand(null)}>
        <DialogContent className="glass-popup border-teal-400/40">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Demanda</DialogTitle>
          </DialogHeader>
          {editingDemand && (
            <DemandForm
              eventId={editingDemand.eventId}
              onSubmit={handleUpdateDemand}
              onCancel={() => setEditingDemand(null)}
              initialData={{
                title: editingDemand.title,
                subject: editingDemand.subject,
                date: editingDemand.date
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deletingDemandId} onOpenChange={() => setDeletingDemandId(null)}>
        <AlertDialogContent className="glass-popup border-teal-400/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-teal-200/70">
              Tem certeza que deseja excluir esta demanda? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass-button">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deletingDemandId && handleDeleteDemand(deletingDemandId)}
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

export default GeneralView;
