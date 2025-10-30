import React, { useState } from 'react';
import { X, MessageCircle, Gift, Star, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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
    phone: '',
    interest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const triggerConfig = {
    discount: {
      title: '🎉 Desconto Especial!',
      subtitle: '20% OFF no seu primeiro corte',
      description: 'Cadastre-se e receba um cupom de desconto exclusivo via WhatsApp!',
      buttonText: 'Quero Meu Desconto',
      icon: Gift,
      color: 'from-amber-400 to-amber-600'
    },
    newsletter: {
      title: '📱 Fique por Dentro!',
      subtitle: 'Novidades e Promoções Exclusivas',
      description: 'Receba dicas de estilo, promoções e novidades direto no seu WhatsApp!',
      buttonText: 'Quero Receber Novidades',
      icon: MessageCircle,
      color: 'from-blue-400 to-blue-600'
    },
    consultation: {
      title: '✂️ Consultoria Gratuita!',
      subtitle: 'Descubra o corte ideal para você',
      description: 'Nossos especialistas vão te ajudar a escolher o melhor estilo!',
      buttonText: 'Quero Consultoria Grátis',
      icon: Star,
      color: 'from-purple-400 to-purple-600'
    },
    general: {
      title: '🔥 Entre em Contato!',
      subtitle: 'Vamos conversar pelo WhatsApp',
      description: 'Tire suas dúvidas e agende seu horário de forma rápida e fácil!',
      buttonText: 'Entrar em Contato',
      icon: MessageCircle,
      color: 'from-green-400 to-green-600'
    }
  };

  const config = triggerConfig[trigger];

  const interests = [
    'Corte de Cabelo',
    'Barba Completa',
    'Corte + Barba',
    'Design de Sobrancelha',
    'Tratamento Capilar',
    'Consultoria de Estilo',
    'Apenas Informações'
  ];

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const generateWhatsAppMessage = () => {
    let message = `🔥 *NOVO LEAD - BARBEARIA PREMIUM* 🔥\n\n`;
    message += `👤 *Nome:* ${formData.name}\n`;
    message += `📱 *Telefone:* ${formData.phone}\n`;
    message += `💡 *Interesse:* ${formData.interest}\n`;
    message += `📍 *Origem:* Landing Page - ${trigger}\n\n`;
    
    switch (trigger) {
      case 'discount':
        message += `🎁 *Cliente interessado no desconto de 20% OFF!*\n`;
        message += `Por favor, envie o cupom de desconto e informações sobre agendamento.`;
        break;
      case 'newsletter':
        message += `📧 *Cliente quer receber novidades e promoções!*\n`;
        message += `Por favor, adicione à lista de WhatsApp e envie as últimas promoções.`;
        break;
      case 'consultation':
        message += `✂️ *Cliente interessado em consultoria gratuita!*\n`;
        message += `Por favor, agende uma consultoria de estilo personalizada.`;
        break;
      default:
        message += `💬 *Cliente quer mais informações!*\n`;
        message += `Por favor, entre em contato para esclarecer dúvidas e agendar.`;
    }
    
    return encodeURIComponent(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Por favor, preencha nome e telefone!');
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
      
      // Feedback baseado no trigger
      switch (trigger) {
        case 'discount':
          toast.success('🎉 Redirecionando para receber seu desconto!');
          break;
        case 'newsletter':
          toast.success('📱 Você será adicionado à nossa lista VIP!');
          break;
        case 'consultation':
          toast.success('✂️ Agendando sua consultoria gratuita!');
          break;
        default:
          toast.success('💬 Redirecionando para o WhatsApp!');
      }
      
      // Reset form e fechar modal
      setFormData({ name: '', phone: '', interest: '' });
      onClose();
      
    } catch (error) {
      toast.error('Erro ao processar solicitação. Tente novamente!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${config.color} mb-4 mx-auto`}>
              <config.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{config.title}</h3>
            <p className="text-lg text-amber-400 font-semibold">{config.subtitle}</p>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-gray-300 text-center leading-relaxed">
            {config.description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white font-semibold">Nome Completo *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:border-amber-400"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white font-semibold">WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formatPhoneNumber(formData.phone)}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:border-amber-400"
                required
              />
            </div>

            <div>
              <Label className="text-white font-semibold">Principal Interesse (Opcional)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={formData.interest === interest ? "default" : "outline"}
                    className={`cursor-pointer text-center py-2 transition-all duration-300 ${
                      formData.interest === interest
                        ? 'bg-amber-400 text-black border-amber-400'
                        : 'border-gray-600 text-gray-300 hover:border-amber-400 hover:text-amber-400'
                    }`}
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      interest: prev.interest === interest ? '' : interest 
                    }))}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r ${config.color} text-white font-bold py-4 text-lg hover:scale-105 transition-all duration-500 shadow-2xl`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Processando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 mr-3" />
                  {config.buttonText}
                </div>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              🔒 Seus dados estão seguros conosco
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal;