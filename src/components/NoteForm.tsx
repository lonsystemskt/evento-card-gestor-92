
import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { NoteFormData } from '@/types';

interface NoteFormProps {
  onSubmit: (data: NoteFormData) => void;
  onCancel: () => void;
  initialData?: Partial<NoteFormData>;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<NoteFormData>({
    subject: initialData?.subject || '',
    priorityDate: initialData?.priorityDate || new Date(),
    owner: initialData?.owner || 'Thiago',
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.subject.trim()) {
      onSubmit(formData);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, priorityDate: date }));
      setIsCalendarOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-white">Assunto</Label>
        <Textarea
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="glass-input border-teal-400/40 text-white placeholder:text-gray-400 min-h-[100px] resize-none"
          placeholder="Assunto da anotação"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Data de Prioridade</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal glass-input border-teal-400/40 text-white",
                !formData.priorityDate && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.priorityDate ? format(formData.priorityDate, "dd/MM/yyyy") : "Selecione uma data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 glass-popup border-teal-400/40" align="start">
            <CalendarComponent
              mode="single"
              selected={formData.priorityDate}
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-white">Responsável</Label>
        <Select 
          value={formData.owner} 
          onValueChange={(value: 'Thiago' | 'Kalil') => 
            setFormData(prev => ({ ...prev, owner: value }))
          }
        >
          <SelectTrigger className="glass-input border-teal-400/40 text-white">
            <SelectValue placeholder="Selecione o responsável" />
          </SelectTrigger>
          <SelectContent className="glass-popup border-teal-400/40">
            <SelectItem value="Thiago" className="text-white hover:bg-white/10">
              Thiago
            </SelectItem>
            <SelectItem value="Kalil" className="text-white hover:bg-white/10">
              Kalil
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 glass-button border-teal-400/40 text-white hover:bg-white/10"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-teal-500/30 hover:bg-teal-500/40 text-white border-teal-400/40"
        >
          {initialData ? 'Atualizar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
};

export default NoteForm;
