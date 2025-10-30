import { useState, useEffect } from 'react';

interface LeadData {
  name: string;
  phone: string;
  interest?: string;
  source: string;
  timestamp: number;
}

interface LeadCaptureConfig {
  autoShowDelay?: number;
  exitIntentEnabled?: boolean;
  scrollPercentageThreshold?: number;
}

export const useLeadCapture = (config: LeadCaptureConfig = {}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalTrigger, setModalTrigger] = useState<'discount' | 'newsletter' | 'consultation' | 'general'>('general');
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);
  const [hasShownScrollTrigger, setHasShownScrollTrigger] = useState(false);

  const {
    autoShowDelay = 30000, // 30 segundos
    exitIntentEnabled = true,
    scrollPercentageThreshold = 70
  } = config;

  // Salvar lead no localStorage para analytics
  const saveLead = (leadData: LeadData) => {
    try {
      const existingLeads = JSON.parse(localStorage.getItem('barbershop_leads') || '[]');
      const newLead = {
        ...leadData,
        id: Date.now().toString(),
        timestamp: Date.now()
      };
      
      existingLeads.push(newLead);
      localStorage.setItem('barbershop_leads', JSON.stringify(existingLeads));
      
      // Enviar para analytics (simulado)
      console.log('Lead capturado:', newLead);
      
      return newLead;
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
    }
  };

  // Verificar se usuário já converteu
  const hasUserConverted = () => {
    try {
      const leads = JSON.parse(localStorage.getItem('barbershop_leads') || '[]');
      return leads.length > 0;
    } catch {
      return false;
    }
  };

  // Trigger por tempo na página
  useEffect(() => {
    if (hasUserConverted()) return;

    const timer = setTimeout(() => {
      if (!showModal) {
        setModalTrigger('newsletter');
        setShowModal(true);
      }
    }, autoShowDelay);

    return () => clearTimeout(timer);
  }, [autoShowDelay, showModal]);

  // Trigger por exit intent
  useEffect(() => {
    if (!exitIntentEnabled || hasUserConverted() || hasShownExitIntent) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showModal) {
        setModalTrigger('discount');
        setShowModal(true);
        setHasShownExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [exitIntentEnabled, showModal, hasShownExitIntent]);

  // Trigger por scroll
  useEffect(() => {
    if (hasUserConverted() || hasShownScrollTrigger) return;

    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrolled >= scrollPercentageThreshold && !showModal) {
        setModalTrigger('consultation');
        setShowModal(true);
        setHasShownScrollTrigger(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollPercentageThreshold, showModal, hasShownScrollTrigger]);

  // Funções para controle manual
  const triggerLeadCapture = (trigger: typeof modalTrigger) => {
    setModalTrigger(trigger);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Analytics simples
  const getLeadStats = () => {
    try {
      const leads = JSON.parse(localStorage.getItem('barbershop_leads') || '[]');
      const today = new Date().toDateString();
      
      return {
        total: leads.length,
        today: leads.filter((lead: LeadData) => 
          new Date(lead.timestamp).toDateString() === today
        ).length,
        sources: leads.reduce((acc: Record<string, number>, lead: LeadData) => {
          acc[lead.source] = (acc[lead.source] || 0) + 1;
          return acc;
        }, {})
      };
    } catch {
      return { total: 0, today: 0, sources: {} };
    }
  };

  return {
    showModal,
    modalTrigger,
    triggerLeadCapture,
    closeModal,
    saveLead,
    hasUserConverted: hasUserConverted(),
    getLeadStats
  };
};

// Hook para WhatsApp Business integration
export const useWhatsAppBusiness = () => {
  const businessNumber = '5511999999999';
  
  const sendMessage = (message: string, phone?: string) => {
    const targetNumber = phone || businessNumber;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${targetNumber}?text=${encodedMessage}`;
    
    window.open(url, '_blank');
  };

  const sendLeadMessage = (leadData: LeadData) => {
    let message = `🔥 *NOVO LEAD - BARBEARIA PREMIUM* 🔥\n\n`;
    message += `👤 *Nome:* ${leadData.name}\n`;
    message += `📱 *Telefone:* ${leadData.phone}\n`;
    
    if (leadData.interest) {
      message += `💡 *Interesse:* ${leadData.interest}\n`;
    }
    
    message += `📍 *Origem:* ${leadData.source}\n`;
    message += `⏰ *Data/Hora:* ${new Date(leadData.timestamp).toLocaleString('pt-BR')}\n\n`;
    message += `✅ *Novo cliente em potencial!* Entre em contato o mais rápido possível.`;
    
    sendMessage(message);
  };

  const sendBookingMessage = (bookingData: any) => {
    let message = `📅 *NOVO AGENDAMENTO* 📅\n\n`;
    message += `👤 *Cliente:* ${bookingData.name}\n`;
    message += `📱 *Telefone:* ${bookingData.phone}\n`;
    message += `✂️ *Serviço:* ${bookingData.service}\n`;
    message += `👨‍💼 *Barbeiro:* ${bookingData.barber || 'Qualquer disponível'}\n`;
    message += `📅 *Data:* ${bookingData.date}\n`;
    message += `⏰ *Horário:* ${bookingData.time}\n`;
    
    if (bookingData.notes) {
      message += `📝 *Observações:* ${bookingData.notes}\n`;
    }
    
    message += `\n✅ *Confirmar agendamento!*`;
    
    sendMessage(message);
  };

  const sendQuickMessage = (type: 'info' | 'booking' | 'promotion' | 'consultation') => {
    const messages = {
      info: 'Olá! Gostaria de mais informações sobre os serviços da barbearia.',
      booking: 'Olá! Gostaria de agendar um horário na barbearia.',
      promotion: 'Olá! Vi que vocês têm promoções. Gostaria de saber mais!',
      consultation: 'Olá! Gostaria de uma consultoria de estilo gratuita.'
    };
    
    sendMessage(messages[type]);
  };

  return {
    sendMessage,
    sendLeadMessage,
    sendBookingMessage,
    sendQuickMessage,
    businessNumber
  };
};