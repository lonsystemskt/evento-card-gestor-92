
import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DemandFormData } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DemandFormProps {
  eventId: string;
  onSubmit: (data: DemandFormData) => void;
  onCancel: () => void;
  initialData?: DemandFormData;
}

const DemandForm: React.FC<DemandFormProps> = ({
  eventId,
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState<DemandFormData>({
    title: initialData?.title || '',
    subject: initialData?.subject || '',
    date: initialData?.date || new Date()
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Atualizar dados quando initialData mudar
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        subject: initialData.subject,
        date: initialData.date
      });
    } else {
      setFormData({ title: '', subject: '', date: new Date() });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject.trim()) return;

    onSubmit(formData);
    onCancel();
    
    // Reset form
    setFormData({ title: '', subject: '', date: new Date() });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
      setDatePickerOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-white">Título da Demanda</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Digite o título da demanda"
            className="glass-card border-white/20 text-white placeholder:text-white/50"
            required
          />
        </div>

        <div>
          <Label htmlFor="subject" className="text-white">Assunto</Label>
          <Textarea
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Descreva o assunto da demanda"
            className="glass-card border-white/20 text-white placeholder:text-white/50 resize-none"
            rows={3}
            required
          />
        </div>

        <div>
          <Label className="text-white">Data da Demanda</Label>
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
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={handleDateSelect}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 glass-card border-white/20 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            {initialData ? 'Atualizar' : 'Criar Demanda'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DemandForm;
