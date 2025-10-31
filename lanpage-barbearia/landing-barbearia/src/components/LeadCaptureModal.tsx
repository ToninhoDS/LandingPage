import React, { useState } from 'react';
import { X, MessageCircle, Gift, Star, Phone, User, Mail, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'discount' | 'newsletter' | 'consultation' | 'general';
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ 
  isOpen, 
  onClose, 
  trigger = 'general' 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerConfig = {
    discount: {
      title: '📱 Fique por Dentro!',
      subtitle: 'Novidades e Promoções Exclusivas',
      description: 'Entramos em contato para mostrar o sistema e esclarecer todas as suas dúvidas!',
      buttonText: 'Entramos em Contato para Mostrar o Sistema',
      icon: Gift,
      color: 'from-amber-400 to-amber-600'
    },
    newsletter: {
      title: '📱 Fique por Dentro!',
      subtitle: 'Novidades e Promoções Exclusivas',
      description: 'Entramos em contato para mostrar o sistema e esclarecer todas as suas dúvidas!',
      buttonText: 'Entramos em Contato para Mostrar o Sistema',
      icon: MessageCircle,
      color: 'from-blue-400 to-blue-600'
    },
    consultation: {
      title: '🚀 Demonstração do Sistema',
      subtitle: 'Veja como funciona na prática',
      description: 'Entramos em contato para mostrar o sistema e esclarecer todas as suas dúvidas!',
      buttonText: 'Quero Ver o Sistema',
      icon: Calendar,
      color: 'from-purple-400 to-purple-600'
    },
    general: {
      title: '🚀 Demonstração do Sistema',
      subtitle: 'Veja como funciona na prática',
      description: 'Entramos em contato para mostrar o sistema e esclarecer todas as suas dúvidas!',
      buttonText: 'Quero Ver o Sistema',
      icon: Calendar,
      color: 'from-green-400 to-green-600'
    }
  };

  const config = triggerConfig[trigger];



  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const generateWhatsAppMessage = () => {
    let message = `🚀 *SOLICITAÇÃO DE DEMONSTRAÇÃO - SISTEMA BARBEARIA* 🚀\n\n`;
    message += `👤 *Nome:* ${formData.name}\n`;
    message += `📧 *Email:* ${formData.email}\n`;
    message += `📱 *WhatsApp:* ${formData.phone}\n`;
    message += `📍 *Origem:* Landing Page - Demonstração\n\n`;
    message += `🎯 *AÇÃO:* Entrar em contato para demonstrar o sistema e esclarecer dúvidas sobre a automação da barbearia.`;
    
    return encodeURIComponent(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor, preencha nome, email e WhatsApp!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const whatsappMessage = generateWhatsAppMessage();
      const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`;
      
      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast.success('🚀 Solicitação enviada! Entraremos em contato em breve para demonstrar o sistema.');
      
      // Reset form e fechar modal
       setFormData({ 
         name: '', 
         email: '', 
         phone: ''
       });
      onClose();
      
    } catch (error) {
      toast.error('Erro ao processar solicitação. Tente novamente!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 text-white max-w-md mx-auto max-h-[95vh] overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${config.color} mb-2 mx-auto shadow-lg`}>
              <config.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{config.title}</h3>
            <p className="text-sm text-amber-400 font-semibold">{config.subtitle}</p>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="name" className="text-white text-sm font-medium">Nome Completo *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:border-amber-400 h-9"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white text-sm font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:border-amber-400 h-9"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white text-sm font-medium">WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formatPhoneNumber(formData.phone)}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:border-amber-400 h-9"
                required
              />
            </div>



            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r ${config.color} text-white font-bold py-3 text-base hover:scale-105 transition-all duration-300 shadow-xl`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {config.buttonText}
                </div>
              )}
            </Button>
          </form>

          <div className="text-center space-y-1">
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <CheckCircle className="h-3 w-3" />
              <span className="text-xs">Demonstração gratuita e sem compromisso</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;