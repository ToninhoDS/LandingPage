import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  Star, 
  TrendingUp, 
  Plus,
  Scissors,
  MapPin,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';

// Mock data - será substituído por dados reais da API
const mockStats = {
  totalAgendamentos: 12,
  servicoFavorito: 'Corte + Barba',
  totalGasto: 480.00
};

const mockProximoAgendamento = {
  id: 1,
  data: '2024-01-15',
  hora: '14:30',
  servico: 'Corte + Barba',
  barbeiro: 'João Silva',
  barbearia: 'Barbearia Central',
  endereco: 'Rua das Flores, 123',
  telefone: '(11) 99999-9999',
  preco: 45.00
};

const mockAgendamentos = [
  {
    id: 1,
    data: '2024-01-15',
    hora: '14:30',
    servico: 'Corte + Barba',
    barbeiro: 'João Silva',
    status: 'confirmado'
  },
  {
    id: 2,
    data: '2024-01-18',
    hora: '16:00',
    servico: 'Corte Simples',
    barbeiro: 'Pedro Santos',
    status: 'pendente'
  },
  {
    id: 3,
    data: '2024-01-22',
    hora: '10:00',
    servico: 'Barba',
    barbeiro: 'Carlos Lima',
    status: 'confirmado'
  }
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'text-green-600 bg-green-50';
      case 'pendente':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelado':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {profile?.nome || user?.email?.split('@')[0] || 'Cliente'}! 👋
          </h1>
          <p className="text-gray-600">
            Gerencie seus agendamentos e acompanhe seu histórico
          </p>
        </div>
        <Button 
          onClick={() => navigate('/agendamento')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Próximo Agendamento */}
      {mockProximoAgendamento && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Clock className="h-5 w-5" />
              Próximo Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">
                    {formatDate(mockProximoAgendamento.data)} às {formatTime(mockProximoAgendamento.hora)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-gray-500" />
                  <span>{mockProximoAgendamento.servico}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-500" />
                  <span>{mockProximoAgendamento.barbeiro}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">{mockProximoAgendamento.barbearia}</div>
                    <div className="text-sm text-gray-600">{mockProximoAgendamento.endereco}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{mockProximoAgendamento.telefone}</span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(mockProximoAgendamento.preco)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalAgendamentos}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviço Favorito</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.servicoFavorito}</div>
            <p className="text-xs text-muted-foreground">
              Mais agendado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockStats.totalGasto)}</div>
            <p className="text-xs text-muted-foreground">
              Nos últimos 6 meses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
          <CardDescription>
            Seus agendamentos confirmados e pendentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAgendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {formatDate(agendamento.data).split(',')[0]}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTime(agendamento.hora)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{agendamento.servico}</div>
                    <div className="text-sm text-gray-600">
                      com {agendamento.barbeiro}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agendamento.status)}`}
                  >
                    {getStatusText(agendamento.status)}
                  </span>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {mockAgendamentos.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Que tal agendar seu próximo corte?
              </p>
              <Button onClick={() => navigate('/agendamento')}>
                Fazer Agendamento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}