import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Scissors, 
  Star,
  ArrowLeft,
  Check,
  MessageCircle,
  CalendarPlus
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useIntegrations } from '@/hooks/useIntegrations';

// Mock data - será substituído por dados reais da API
const mockBarbearias = [
  {
    id: 1,
    nome: 'Barbearia Central',
    endereco: 'Rua das Flores, 123 - Centro',
    telefone: '(11) 99999-9999',
    avaliacao: 4.8,
    imagem: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20barbershop%20interior%20with%20vintage%20chairs%20and%20mirrors&image_size=square'
  },
  {
    id: 2,
    nome: 'Barbearia Premium',
    endereco: 'Av. Principal, 456 - Jardins',
    telefone: '(11) 88888-8888',
    avaliacao: 4.9,
    imagem: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20barbershop%20with%20leather%20chairs%20and%20elegant%20decor&image_size=square'
  }
];

const mockServicos = [
  {
    id: 1,
    nome: 'Corte Simples',
    descricao: 'Corte tradicional masculino',
    preco: 25.00,
    duracao: 30
  },
  {
    id: 2,
    nome: 'Corte + Barba',
    descricao: 'Corte completo com barba alinhada',
    preco: 45.00,
    duracao: 60
  },
  {
    id: 3,
    nome: 'Barba',
    descricao: 'Apenas barba e bigode',
    preco: 20.00,
    duracao: 30
  },
  {
    id: 4,
    nome: 'Corte Premium',
    descricao: 'Corte moderno com finalização',
    preco: 35.00,
    duracao: 45
  }
];

const mockBarbeiros = [
  {
    id: 1,
    nome: 'João Silva',
    especialidade: 'Cortes clássicos',
    avaliacao: 4.9,
    imagem: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20barber%20portrait%20smiling%20in%20uniform&image_size=square'
  },
  {
    id: 2,
    nome: 'Pedro Santos',
    especialidade: 'Cortes modernos',
    avaliacao: 4.8,
    imagem: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=young%20professional%20barber%20with%20modern%20style&image_size=square'
  },
  {
    id: 3,
    nome: 'Carlos Lima',
    especialidade: 'Barbas e bigodes',
    avaliacao: 4.7,
    imagem: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=experienced%20barber%20with%20beard%20specialist&image_size=square'
  }
];

// Gerar horários disponíveis
const gerarHorariosDisponiveis = () => {
  const horarios = [];
  for (let hora = 8; hora <= 18; hora++) {
    for (let minuto = 0; minuto < 60; minuto += 30) {
      if (hora === 18 && minuto > 0) break; // Não incluir 18:30
      const horarioStr = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
      horarios.push(horarioStr);
    }
  }
  return horarios;
};

// Gerar datas disponíveis (próximos 30 dias, excluindo domingos)
const gerarDatasDisponiveis = () => {
  const datas = [];
  const hoje = new Date();
  
  for (let i = 1; i <= 30; i++) {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() + i);
    
    // Pular domingos (0 = domingo)
    if (data.getDay() !== 0) {
      datas.push(data.toISOString().split('T')[0]);
    }
  }
  
  return datas;
};

type EtapaAgendamento = 'barbearia' | 'servico' | 'barbeiro' | 'data' | 'horario' | 'confirmacao';

export default function Agendamento() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    whatsappStatus, 
    calendarStatus, 
    sendWhatsAppConfirmation,
    createCalendarEvent,
    processNewAppointment 
  } = useIntegrations();
  const [etapaAtual, setEtapaAtual] = useState<EtapaAgendamento>('barbearia');
  const [agendamento, setAgendamento] = useState({
    barbearia: null as any,
    servico: null as any,
    barbeiro: null as any,
    data: '',
    horario: ''
  });

  const horariosDisponiveis = gerarHorariosDisponiveis();
  const datasDisponiveis = gerarDatasDisponiveis();

  const proximaEtapa = () => {
    const etapas: EtapaAgendamento[] = ['barbearia', 'servico', 'barbeiro', 'data', 'horario', 'confirmacao'];
    const indiceAtual = etapas.indexOf(etapaAtual);
    if (indiceAtual < etapas.length - 1) {
      setEtapaAtual(etapas[indiceAtual + 1]);
    }
  };

  const etapaAnterior = () => {
    const etapas: EtapaAgendamento[] = ['barbearia', 'servico', 'barbeiro', 'data', 'horario', 'confirmacao'];
    const indiceAtual = etapas.indexOf(etapaAtual);
    if (indiceAtual > 0) {
      setEtapaAtual(etapas[indiceAtual - 1]);
    }
  };

  const confirmarAgendamento = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer um agendamento');
      return;
    }

    try {
      // Preparar dados do agendamento
      const appointmentData = {
        id: Date.now().toString(),
        clientName: user.name || 'Cliente',
        clientPhone: user.phone || '',
        clientEmail: user.email || '',
        service: agendamento.servico?.nome || '',
        barber: agendamento.barbeiro?.nome || '',
        date: agendamento.data || '',
        time: agendamento.horario || '',
        duration: agendamento.servico?.duracao || 60,
        price: agendamento.servico?.preco || 0,
        location: agendamento.barbearia?.endereco || '',
        notes: ''
      };

      // Processar agendamento com integrações
      await processNewAppointment(appointmentData);
      
      toast.success('Agendamento confirmado com sucesso!', {
        description: `${formatDate(agendamento.data)} às ${formatTime(agendamento.horario)}`
      });
      
      // Redirecionar para o dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
      toast.error('Erro ao confirmar agendamento. Tente novamente.');
    }
  };

  const renderEtapaBarbearia = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Escolha a Barbearia</h2>
        <p className="text-gray-600">Selecione onde você gostaria de ser atendido</p>
      </div>
      
      <div className="grid gap-4">
        {mockBarbearias.map((barbearia) => (
          <Card 
            key={barbearia.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              agendamento.barbearia?.id === barbearia.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              setAgendamento(prev => ({ ...prev, barbearia }));
              proximaEtapa();
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img 
                  src={barbearia.imagem} 
                  alt={barbearia.nome}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{barbearia.nome}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    {barbearia.endereco}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{barbearia.avaliacao}</span>
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{barbearia.telefone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEtapaServico = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Escolha o Serviço</h2>
        <p className="text-gray-600">Selecione o serviço desejado</p>
      </div>
      
      <div className="grid gap-4">
        {mockServicos.map((servico) => (
          <Card 
            key={servico.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              agendamento.servico?.id === servico.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              setAgendamento(prev => ({ ...prev, servico }));
              proximaEtapa();
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Scissors className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{servico.nome}</h3>
                    <p className="text-sm text-gray-600">{servico.descricao}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{servico.duracao} min</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(servico.preco)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEtapaBarbeiro = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Escolha o Barbeiro</h2>
        <p className="text-gray-600">Selecione o profissional de sua preferência</p>
      </div>
      
      <div className="grid gap-4">
        {mockBarbeiros.map((barbeiro) => (
          <Card 
            key={barbeiro.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              agendamento.barbeiro?.id === barbeiro.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              setAgendamento(prev => ({ ...prev, barbeiro }));
              proximaEtapa();
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img 
                  src={barbeiro.imagem} 
                  alt={barbeiro.nome}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{barbeiro.nome}</h3>
                  <p className="text-sm text-gray-600 mb-1">{barbeiro.especialidade}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{barbeiro.avaliacao}</span>
                    <span className="text-sm text-gray-500 ml-1">avaliação</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEtapaData = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Escolha a Data</h2>
        <p className="text-gray-600">Selecione o dia do seu agendamento</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {datasDisponiveis.slice(0, 12).map((data) => {
          const dataObj = new Date(data + 'T00:00:00');
          const isSelected = agendamento.data === data;
          
          return (
            <Button
              key={data}
              variant={isSelected ? "default" : "outline"}
              className={`h-auto p-3 flex flex-col items-center ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => {
                setAgendamento(prev => ({ ...prev, data }));
                proximaEtapa();
              }}
            >
              <div className="text-xs opacity-75">
                {dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}
              </div>
              <div className="text-lg font-bold">
                {dataObj.getDate()}
              </div>
              <div className="text-xs opacity-75">
                {dataObj.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );

  const renderEtapaHorario = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Escolha o Horário</h2>
        <p className="text-gray-600">Selecione o horário disponível</p>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {horariosDisponiveis.map((horario) => {
          const isSelected = agendamento.horario === horario;
          // Simular alguns horários como indisponíveis
          const isDisponivel = Math.random() > 0.3;
          
          return (
            <Button
              key={horario}
              variant={isSelected ? "default" : "outline"}
              disabled={!isDisponivel}
              className={`h-12 ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              } ${!isDisponivel ? 'opacity-50' : ''}`}
              onClick={() => {
                if (isDisponivel) {
                  setAgendamento(prev => ({ ...prev, horario }));
                  proximaEtapa();
                }
              }}
            >
              {formatTime(horario)}
            </Button>
          );
        })}
      </div>
      
      <div className="text-center text-sm text-gray-600 mt-4">
        <p>Horários em cinza não estão disponíveis</p>
      </div>
    </div>
  );

  const renderEtapaConfirmacao = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Confirmar Agendamento</h2>
        <p className="text-gray-600">Revise os detalhes do seu agendamento</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Resumo do Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Barbearia</Label>
              <p className="font-semibold">{agendamento.barbearia?.nome}</p>
              <p className="text-sm text-gray-600">{agendamento.barbearia?.endereco}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600">Serviço</Label>
              <p className="font-semibold">{agendamento.servico?.nome}</p>
              <p className="text-sm text-gray-600">{agendamento.servico?.descricao}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600">Barbeiro</Label>
              <p className="font-semibold">{agendamento.barbeiro?.nome}</p>
              <p className="text-sm text-gray-600">{agendamento.barbeiro?.especialidade}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600">Data e Horário</Label>
              <p className="font-semibold">
                {formatDate(agendamento.data)} às {formatTime(agendamento.horario)}
              </p>
              <p className="text-sm text-gray-600">Duração: {agendamento.servico?.duracao} min</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(agendamento.servico?.preco || 0)}
              </span>
            </div>
            
            {/* Status das Integrações */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Serviços Inclusos:</Label>
              <div className="flex flex-wrap gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  whatsappStatus.isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  <MessageCircle className="h-3 w-3" />
                  Confirmação WhatsApp
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                  calendarStatus.isConnected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  <CalendarPlus className="h-3 w-3" />
                  Sincronização Calendário
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-3">
        <Button variant="outline" onClick={etapaAnterior} className="flex-1">
          Voltar
        </Button>
        <Button onClick={confirmarAgendamento} className="flex-1">
          Confirmar Agendamento
        </Button>
      </div>
    </div>
  );

  const renderEtapaAtual = () => {
    switch (etapaAtual) {
      case 'barbearia':
        return renderEtapaBarbearia();
      case 'servico':
        return renderEtapaServico();
      case 'barbeiro':
        return renderEtapaBarbeiro();
      case 'data':
        return renderEtapaData();
      case 'horario':
        return renderEtapaHorario();
      case 'confirmacao':
        return renderEtapaConfirmacao();
      default:
        return null;
    }
  };

  const getProgressPercentage = () => {
    const etapas = ['barbearia', 'servico', 'barbeiro', 'data', 'horario', 'confirmacao'];
    const indiceAtual = etapas.indexOf(etapaAtual);
    return ((indiceAtual + 1) / etapas.length) * 100;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Novo Agendamento</h1>
          <p className="text-gray-600">Siga os passos para agendar seu serviço</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      {/* Etapa Atual */}
      <Card>
        <CardContent className="p-6">
          {renderEtapaAtual()}
        </CardContent>
      </Card>

      {/* Botões de Navegação */}
      {etapaAtual !== 'barbearia' && etapaAtual !== 'confirmacao' && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={etapaAnterior} className="flex-1">
            Voltar
          </Button>
        </div>
      )}
    </div>
  );
}