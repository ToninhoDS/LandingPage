import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LeadCaptureModal from './LeadCaptureModal';

const WhatsAppFloatingButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadModalTrigger, setLeadModalTrigger] = useState<'discount' | 'newsletter' | 'consultation' | 'general'>('general');

  useEffect(() => {
    // Mostrar o botão após 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    {
      id: 'agendar',
      icon: Calendar,
      label: 'Agendar Horário',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        const message = encodeURIComponent('Olá! Gostaria de agendar um horário na barbearia. Podem me ajudar?');
        window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
        setIsExpanded(false);
      }
    },
    {
      id: 'informacoes',
      icon: Info,
      label: 'Informações',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        setLeadModalTrigger('general');
        setShowLeadModal(true);
        setIsExpanded(false);
      }
    },
    {
      id: 'promocoes',
      icon: MessageCircle,
      label: 'Promoções',
      color: 'bg-amber-500 hover:bg-amber-600',
      action: () => {
        setLeadModalTrigger('discount');
        setShowLeadModal(true);
        setIsExpanded(false);
      }
    },
    {
      id: 'ligar',
      icon: Phone,
      label: 'Ligar Agora',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        window.open('tel:+5511999999999', '_self');
        setIsExpanded(false);
      }
    }
  ];

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Menu expandido */}
        {isExpanded && (
          <div className="mb-4 space-y-3 animate-fade-in">
            {quickActions.map((action, index) => (
              <Card
                key={action.id}
                className={`p-4 bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={action.action}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-gray-800 font-semibold whitespace-nowrap">
                    {action.label}
                  </span>
                </div>
              </Card>
            ))}
            
            {/* Mensagem de boas-vindas */}
            <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg animate-slide-up">
              <div className="text-center">
                <h4 className="font-bold mb-1">🔥 Barbearia Premium</h4>
                <p className="text-sm opacity-90">Como podemos te ajudar hoje?</p>
              </div>
            </Card>
          </div>
        )}

        {/* Botão principal */}
        <Button
          className={`w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-2xl hover:shadow-green-500/50 transition-all duration-500 transform hover:scale-110 ${
            isExpanded ? 'rotate-45' : 'animate-bounce'
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <X className="h-8 w-8" />
          ) : (
            <MessageCircle className="h-8 w-8" />
          )}
        </Button>

        {/* Indicador de notificação */}
        {!isExpanded && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>

      {/* Overlay para fechar o menu */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Modal de captura de leads */}
      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        trigger={leadModalTrigger}
      />


    </>
  );
};

export default WhatsAppFloatingButton;