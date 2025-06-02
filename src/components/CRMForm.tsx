
import React, { useState, useEffect } from 'react';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CRMFormData } from '@/types';

interface CRMFormProps {
  onSubmit: (data: CRMFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CRMFormData>;
}

const CRMForm: React.FC<CRMFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<CRMFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    subject: initialData?.subject || '',
    priorityDate: initialData?.priorityDate || new Date(),
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.email.trim() && formData.subject.trim()) {
      onSubmit(formData);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Criar uma nova data no horário local para evitar problemas de fuso horário
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      setFormData(prev => ({ ...prev, priorityDate: localDate }));
      setIsCalendarOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">Nome</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="glass-input border-teal-400/40 text-white placeholder:text-gray-400"
          placeholder="Nome completo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="glass-input border-teal-400/40 text-white placeholder:text-gray-400"
          placeholder="email@exemplo.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-white">Telefone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="glass-input border-teal-400/40 text-white placeholder:text-gray-400"
          placeholder="(11) 99999-9999"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-white">Assunto</Label>
        <Input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className="glass-input border-teal-400/40 text-white placeholder:text-gray-400"
          placeholder="Assunto do contato"
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

export default CRMForm;
