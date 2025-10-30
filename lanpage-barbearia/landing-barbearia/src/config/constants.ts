// Configurações da Barbearia
export const BUSINESS_CONFIG = {
  // Contato
  whatsappNumber: '5511999999999',
  phoneNumber: '+5511999999999',
  email: 'contato@barbeariapremium.com',
  
  // Endereço
  address: {
    street: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    full: 'Rua das Flores, 123 - Centro, São Paulo - SP, 01234-567'
  },
  
  // Horários de funcionamento
  businessHours: {
    monday: { open: '09:00', close: '19:00' },
    tuesday: { open: '09:00', close: '19:00' },
    wednesday: { open: '09:00', close: '19:00' },
    thursday: { open: '09:00', close: '20:00' },
    friday: { open: '09:00', close: '20:00' },
    saturday: { open: '08:00', close: '18:00' },
    sunday: { open: null, close: null } // Fechado
  },
  
  // Redes sociais
  socialMedia: {
    instagram: 'https://instagram.com/barbeariapremium',
    facebook: 'https://facebook.com/barbeariapremium',
    youtube: 'https://youtube.com/@barbeariapremium'
  },
  
  // Configurações do negócio
  name: 'Barbearia Premium',
  tagline: 'Estilo e Tradição em Cada Corte',
  description: 'A melhor barbearia da região com profissionais especializados e ambiente acolhedor.'
};

// Serviços disponíveis
export const SERVICES = [
  { id: 'corte-classico', name: 'Corte Clássico', price: 'R$ 35', duration: '30 min' },
  { id: 'corte-moderno', name: 'Corte Moderno', price: 'R$ 45', duration: '45 min' },
  { id: 'barba-completa', name: 'Barba Completa', price: 'R$ 25', duration: '20 min' },
  { id: 'corte-barba', name: 'Corte + Barba', price: 'R$ 60', duration: '50 min' },
  { id: 'design-sobrancelha', name: 'Design de Sobrancelha', price: 'R$ 15', duration: '15 min' },
  { id: 'tratamento-capilar', name: 'Tratamento Capilar', price: 'R$ 80', duration: '60 min' }
];

// Barbeiros
export const BARBERS = [
  { id: 'carlos', name: 'Carlos Silva', rating: 4.9, specialties: ['Corte Clássico', 'Barba'] },
  { id: 'roberto', name: 'Roberto Santos', rating: 4.8, specialties: ['Fade', 'Design'] },
  { id: 'fernando', name: 'Fernando Costa', rating: 4.7, specialties: ['Moicano', 'Barba'] },
  { id: 'qualquer', name: 'Qualquer Barbeiro Disponível', rating: 4.8, specialties: ['Todos os Serviços'] }
];

// Horários disponíveis para agendamento
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00'
];

// URLs do WhatsApp
export const WHATSAPP_URLS = {
  base: `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}`,
  booking: `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=Olá! Gostaria de agendar um horário na barbearia.`,
  contact: `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=Olá! Gostaria de mais informações sobre os serviços.`,
  emergency: `https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=Olá! Preciso de atendimento urgente.`
};