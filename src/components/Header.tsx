import React, { useState, useEffect } from 'react';
import { Archive, CheckCircle, List, Users, StickyNote } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 
              className="text-2xl font-bold text-white cursor-pointer hover:text-blue-300 transition-colors"
              onClick={() => navigate('/')}
            >
              Lon Demandas
            </h1>
            <p className="text-sm text-blue-200/80">
              Bem-vindo, hoje é {formatDate(currentTime)} – {formatTime(currentTime)}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className={`glass-button px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') ? 'bg-blue-500/40 text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              Demandas
            </button>

            <button
              onClick={() => navigate('/geral')}
              className={`glass-button px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                isActive('/geral') ? 'bg-blue-500/40 text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              <List size={16} />
              <span>Geral</span>
            </button>

            <button
              onClick={() => navigate('/crm')}
              className={`glass-button px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                isActive('/crm') ? 'bg-blue-500/40 text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              <Users size={16} />
              <span>CRM</span>
            </button>

            <button
              onClick={() => navigate('/anotacoes')}
              className={`glass-button px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                isActive('/anotacoes') ? 'bg-blue-500/40 text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              <StickyNote size={16} />
              <span>Anotações</span>
            </button>
            
            <button
              onClick={() => navigate('/eventos-arquivados')}
              className={`glass-button px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                isActive('/eventos-arquivados') ? 'bg-blue-500/40 text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              <Archive size={16} />
              <span>Arquivados</span>
            </button>
            
            <button
              onClick={() => navigate('/demandas-concluidas')}
              className={`glass-button px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                isActive('/demandas-concluidas') ? 'bg-blue-500/40 text-white' : 'text-blue-200 hover:text-white'
              }`}
            >
              <CheckCircle size={16} />
              <span>Concluídas</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
