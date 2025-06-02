
import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Event, EventFormData } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Event;
}

const EventForm: React.FC<EventFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    name: initialData?.name || '',
    date: initialData?.date || new Date(),
    logo: undefined
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo || null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Atualizar dados quando initialData mudar
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        date: initialData.date,
        logo: undefined
      });
      setLogoPreview(initialData.logo || null);
    } else {
      setFormData({ name: '', date: new Date(), logo: undefined });
      setLogoPreview(null);
    }
  }, [initialData]);

  // Fechar modal ao clicar fora, mas não no calendário
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        // Verificar se o clique foi no calendário
        if (calendarRef.current && calendarRef.current.contains(event.target as Node)) {
          return; // Não fechar se clicou no calendário
        }
        // Se o calendário estiver aberto, não fechar o modal
        if (datePickerOpen) {
          return;
        }
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, datePickerOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSubmit(formData);
    onClose();
    
    // Reset form
    setFormData({ name: '', date: new Date(), logo: undefined });
    setLogoPreview(null);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Criar uma nova data no horário local para evitar problemas de fuso horário
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      setFormData(prev => ({ ...prev, date: localDate }));
      setDatePickerOpen(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="glass-popup rounded-2xl p-6 w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Editar Evento' : 'Novo Evento'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Nome do Evento</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome do evento"
              className="glass-card border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>

          <div>
            <Label className="text-white">Data do Evento</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal glass-card border-white/20 text-white hover:bg-white/10",
                    !formData.date && "text-white/50"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0 glass-popup border-blue-400/30 shadow-2xl backdrop-blur-xl z-[10000]" 
                align="start"
                side="top"
                sideOffset={10}
              >
                <div ref={calendarRef} className="pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-white">Logo do Evento</Label>
            <div className="flex items-center space-x-4">
              <label className="glass-button px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-500/30 transition-all flex items-center space-x-2">
                <Upload size={16} className="text-blue-300" />
                <span className="text-white">Escolher arquivo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
              
              {logoPreview && (
                <div className="w-12 h-12 glass-card rounded-lg overflow-hidden">
                  <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 glass-card border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {initialData ? 'Atualizar' : 'Criar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
