
// Utilitários para lidar com datas no fuso horário de Brasília
export const createLocalDate = (date: Date): Date => {
  // Pegar os componentes da data no fuso horário local
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Criar uma nova data explicitamente no fuso horário local
  // Isso evita problemas com UTC vs local timezone
  const localDate = new Date(year, month, day, 12, 0, 0, 0); // Usar meio-dia para evitar problemas de DST
  
  return localDate;
};

export const formatDateForBrazil = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const compareDatesIgnoreTime = (date1: Date, date2: Date): number => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
  return Math.ceil((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));
};

export const getTodayInBrazil = (): Date => {
  const now = new Date();
  // Criar data de hoje no fuso horário local do Brasil
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
};
