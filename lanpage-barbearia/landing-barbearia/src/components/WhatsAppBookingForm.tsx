import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, MessageCircle, CheckCircle, Star, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const WhatsAppBookingForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    barber: '',
    date: '',
    time: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('whatsapp-booking');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const services = [
    { id: 'corte-classico', name: 'Corte Clássico', price: 'R$ 35', duration: '30 min' },
    { id: 'corte-moderno', name: 'Corte Moderno', price: 'R$ 45', duration: '45 min' },
    { id: 'barba-completa', name: 'Barba Completa', price: 'R$ 25', duration: '20 min' },
    { id: 'corte-barba', name: 'Corte + Barba', price: 'R$ 60', duration: '50 min' },
    { id: 'design-sobrancelha', name: 'Design de Sobrancelha', price: 'R$ 15', duration: '15 min' },
    { id: 'tratamento-capilar', name: 'Tratamento Capilar', price: 'R$ 80', duration: '60 min' }
  ];

  const barbers = [
    { id: 'carlos', name: 'Carlos Silva', rating: 4.9, specialties: ['Corte Clássico', 'Barba'] },
    { id: 'roberto', name: 'Roberto Santos', rating: 4.8, specialties: ['Fade', 'Design'] },
    { id: 'fernando', name: 'Fernando Costa', rating: 4.7, specialties: ['Moicano', 'Barba'] },
    { id: 'qualquer', name: 'Qualquer Barbeiro Disponível', rating: 4.8, specialties: ['Todos os Serviços'] }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const generateWhatsAppMessage = () => {
    const selectedService = services.find(s => s.id === formData.service);
    const selectedBarber = barbers.find(b => b.id === formData.barber);
    
    let message = `🔥 *AGENDAMENTO BARBEARIA PREMIUM* 🔥\n\n`;
    message += `👤 *Cliente:* ${formData.name}\n`;
    message += `📱 *Telefone:* ${formData.phone}\n\n`;
    message += `✂️ *Serviço:* ${selectedService?.name} (${selectedService?.price})\n`;
    message += `👨‍💼 *Barbeiro:* ${selectedBarber?.name}\n`;
    message += `📅 *Data:* ${new Date(formData.date).toLocaleDateString('pt-BR')}\n`;
    message += `⏰ *Horário:* ${formData.time}\n`;
    
    if (formData.notes) {
      message += `\n📝 *Observações:* ${formData.notes}\n`;
    }
    
    message += `\n✅ Gostaria de confirmar este agendamento!`;
    
    return encodeURIComponent(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!formData.name || !formData.phone || !formData.service || !formData.date || !formData.time) {
      toast.error('Por favor, preencha todos os campos obrigatórios!');
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
      
      toast.success('Redirecionando para o WhatsApp para confirmar seu agendamento!');
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        service: '',
        barber: '',
        date: '',
        time: '',
        notes: ''
      });
      
    } catch (error) {
      toast.error('Erro ao processar agendamento. Tente novamente!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <section id="whatsapp-booking" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-green-500/15 text-green-400 text-lg font-semibold rounded-full border border-green-500/30 backdrop-blur-sm inline-block mb-8">
              📱 Agendamento via WhatsApp
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Agende Seu
              <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Horário Agora
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Preencha o formulário e confirme seu agendamento diretamente pelo WhatsApp. 
              Rápido, fácil e seguro!
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulário */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Card className="bg-white/10 backdrop-blur-md border-amber-400/30 p-8 hover:bg-white/15 transition-all duration-500">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
                    <Scissors className="h-6 w-6 text-amber-400 mr-3" />
                    Dados do Agendamento
                  </h3>
                  <p className="text-gray-400">Preencha suas informações para continuar</p>
                </div>

                {/* Informações Pessoais */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white font-semibold">Nome Completo *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
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
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                {/* Serviço */}
                <div>
                  <Label className="text-white font-semibold">Serviço Desejado *</Label>
                  <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                    <SelectTrigger className="bg-white/10 border-gray-600 text-white focus:border-amber-400">
                      <SelectValue placeholder="Escolha o serviço" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id} className="text-white hover:bg-gray-700">
                          <div className="flex justify-between items-center w-full">
                            <span>{service.name}</span>
                            <div className="flex gap-2 ml-4">
                              <Badge variant="secondary" className="bg-amber-400/20 text-amber-400">
                                {service.price}
                              </Badge>
                              <Badge variant="outline" className="border-gray-500 text-gray-300">
                                {service.duration}
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Barbeiro */}
                <div>
                  <Label className="text-white font-semibold">Barbeiro de Preferência</Label>
                  <Select value={formData.barber} onValueChange={(value) => handleInputChange('barber', value)}>
                    <SelectTrigger className="bg-white/10 border-gray-600 text-white focus:border-amber-400">
                      <SelectValue placeholder="Escolha o barbeiro (opcional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {barbers.map((barber) => (
                        <SelectItem key={barber.id} value={barber.id} className="text-white hover:bg-gray-700">
                          <div className="flex items-center justify-between w-full">
                            <span>{barber.name}</span>
                            <div className="flex items-center gap-1 ml-4">
                              <Star className="h-4 w-4 text-amber-400 fill-current" />
                              <span className="text-amber-400 text-sm">{barber.rating}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data e Hora */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-white font-semibold">Data *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={getTomorrowDate()}
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="bg-white/10 border-gray-600 text-white focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-white font-semibold">Horário *</Label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                      <SelectTrigger className="bg-white/10 border-gray-600 text-white focus:border-amber-400">
                        <SelectValue placeholder="Escolha o horário" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time} className="text-white hover:bg-gray-700">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <Label htmlFor="notes" className="text-white font-semibold">Observações (Opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Alguma observação especial ou preferência..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="bg-white/10 border-gray-600 text-white placeholder-gray-400 focus:border-amber-400 resize-none"
                    rows={3}
                  />
                </div>

                {/* Botão de Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-6 text-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-500 shadow-2xl shadow-green-500/40 hover:shadow-green-500/60"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 mr-3" />
                      Agendar via WhatsApp
                    </div>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Informações e Benefícios */}
          <div className={`space-y-8 transform transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {/* Vantagens do Agendamento */}
            <Card className="bg-white/10 backdrop-blur-md border-amber-400/30 p-8 hover:bg-white/15 transition-all duration-500">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                Vantagens do Agendamento
              </h3>
              <div className="space-y-4">
                {[
                  'Confirmação instantânea via WhatsApp',
                  'Sem filas ou tempo de espera',
                  'Escolha seu barbeiro favorito',
                  'Lembretes automáticos do agendamento',
                  'Reagendamento fácil se necessário',
                  'Atendimento personalizado garantido'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Horários de Funcionamento */}
            <Card className="bg-white/10 backdrop-blur-md border-amber-400/30 p-8 hover:bg-white/15 transition-all duration-500">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Clock className="h-6 w-6 text-amber-400 mr-3" />
                Horários de Funcionamento
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Segunda a Quarta</span>
                  <span className="text-white font-semibold">09:00 - 19:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Quinta e Sexta</span>
                  <span className="text-white font-semibold">09:00 - 20:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Sábado</span>
                  <span className="text-white font-semibold">08:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Domingo</span>
                  <span className="text-red-400 font-semibold">Fechado</span>
                </div>
              </div>
            </Card>

            {/* Contato Direto */}
            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 p-8 hover:from-green-500/30 hover:to-green-600/30 transition-all duration-500">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <MessageCircle className="h-6 w-6 text-green-400 mr-3" />
                Prefere Falar Direto?
              </h3>
              <p className="text-gray-300 mb-6">
                Entre em contato conosco diretamente pelo WhatsApp para tirar dúvidas ou fazer seu agendamento.
              </p>
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4"
                onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Gostaria de agendar um horário na barbearia.', '_blank')}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chamar no WhatsApp
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppBookingForm;