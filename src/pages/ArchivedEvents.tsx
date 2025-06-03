
import React from 'react';
import { RotateCcw, Trash2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import { useEventManager } from '@/hooks/useEventManager';
import { useToast } from '@/hooks/use-toast';

const ArchivedEvents = () => {
  const { getArchivedEvents, updateEvent, deleteEvent, lastUpdate } = useEventManager();
  const { toast } = useToast();
  const archivedEvents = getArchivedEvents();

  console.log('📁 ArchivedEvents - Eventos arquivados:', archivedEvents.length);
  console.log('📁 ArchivedEvents - Última atualização:', new Date(lastUpdate).toLocaleTimeString());

  const handleRestore = (id: string) => {
    console.log('🔄 Restaurando evento:', id);
    updateEvent(id, { isArchived: false });
    toast({
      title: "Evento restaurado",
      description: "O evento foi restaurado para ativo.",
    });
  };

  const handlePermanentDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente este evento? Esta ação não pode ser desfeita.')) {
      console.log('🗑️ Excluindo permanentemente evento:', id);
      deleteEvent(id);
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído permanentemente.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full">
      <Header />
      
      <div className="pt-24 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Eventos Arquivados</h1>
          <p className="text-blue-200/70 mb-1">Gerencie seus eventos arquivados</p>
          <p className="text-xs text-blue-200/50">
            Última atualização: {new Date(lastUpdate).toLocaleTimeString()}
          </p>
        </div>

        {archivedEvents.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhum evento arquivado</h3>
              <p className="text-blue-200/70">
                Os eventos arquivados aparecerão aqui
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {archivedEvents.map((event) => (
              <div key={event.id} className="glass rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 glass-card rounded-lg flex items-center justify-center overflow-hidden">
                      {event.logo ? (
                        <img src={event.logo} alt={event.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-gray-500/30 rounded-lg flex items-center justify-center">
                          <span className="text-gray-300 font-bold text-sm">
                            {event.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-white font-medium">{event.name}</h3>
                      <p className="text-blue-200/70 text-sm">
                        {event.date.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRestore(event.id)}
                      className="glass-button px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center space-x-2"
                    >
                      <RotateCcw size={16} className="text-blue-300" />
                      <span className="text-white">Restaurar</span>
                    </button>
                    
                    <button
                      onClick={() => handlePermanentDelete(event.id)}
                      className="glass-button px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all flex items-center space-x-2"
                    >
                      <Trash2 size={16} className="text-red-300" />
                      <span className="text-white">Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedEvents;
