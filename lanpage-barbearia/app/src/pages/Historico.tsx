import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Scissors, 
  Star,
  Search,
  Filter,
  Download,
  Eye,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { toast } from 'sonner';

// Mock data - será substituído por dados reais da API
const mockHistorico = [
  {
    id: 1,
    data: '2024-01-10',
    hora: '14:30',
    servico: 'Corte + Barba',
    barbeiro: 'João Silva',
    barbearia: 'Barbearia Central',
    endereco: 'Rua das Flores, 123',
    preco: 45.00,
    status: 'concluido',
    avaliacao: 5,
    comentario: 'Excelente atendimento! Muito satisfeito com o resultado.',
    duracao: 60
  },
  {
    id: 2,
    data: '2023-12-28',
    hora: '16:00',
    servico: 'Corte Simples',
    barbeiro: 'Pedro Santos',
    barbearia: 'Barbearia Premium',
    endereco: 'Av. Principal, 456',
    preco: 25.00,
    status: 'concluido',
    avaliacao: 4,
    comentario: 'Bom atendimento, corte ficou como esperado.',
    duracao: 30
  },
  {
    id: 3,
    data: '2023-12-15',
    hora: '10:00',
    servico: 'Barba',
    barbeiro: 'Carlos Lima',
    barbearia: 'Barbearia Central',
    endereco: 'Rua das Flores, 123',
    preco: 20.00,
    status: 'concluido',
    avaliacao: 5,
    comentario: 'Profissional muito experiente, barba ficou perfeita!',
    duracao: 30
  },
  {
    id: 4,
    data: '2023-12-01',
    hora: '15:30',
    servico: 'Corte Premium',
    barbeiro: 'João Silva',
    barbearia: 'Barbearia Central',
    endereco: 'Rua das Flores, 123',
    preco: 35.00,
    status: 'cancelado',
    avaliacao: null,
    comentario: null,
    duracao: 45,
    motivoCancelamento: 'Cancelado pelo cliente'
  },
  {
    id: 5,
    data: '2023-11-20',
    hora: '11:00',
    servico: 'Corte + Barba',
    barbeiro: 'Pedro Santos',
    barbearia: 'Barbearia Premium',
    endereco: 'Av. Principal, 456',
    preco: 45.00,
    status: 'concluido',
    avaliacao: 4,
    comentario: 'Muito bom, recomendo!',
    duracao: 60
  }
];

const statusColors = {
  concluido: 'text-green-600 bg-green-50',
  cancelado: 'text-red-600 bg-red-50',
  pendente: 'text-yellow-600 bg-yellow-50'
};

const statusText = {
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  pendente: 'Pendente'
};

export default function Historico() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [selectedAgendamento, setSelectedAgendamento] = useState<any>(null);

  const filteredHistorico = mockHistorico.filter(agendamento => {
    const matchesSearch = 
      agendamento.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.barbeiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.barbearia.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'todos' || agendamento.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalGasto = mockHistorico
    .filter(a => a.status === 'concluido')
    .reduce((total, a) => total + a.preco, 0);

  const totalAgendamentos = mockHistorico.filter(a => a.status === 'concluido').length;

  const handleReagendarServico = (agendamento: any) => {
    toast.success('Redirecionando para agendamento...');
    // Aqui seria redirecionado para a página de agendamento com os dados pré-preenchidos
  };

  const handleAvaliarServico = (agendamento: any) => {
    toast.success('Funcionalidade de avaliação em desenvolvimento');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderDetalhesAgendamento = (agendamento: any) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Detalhes do Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Data e Horário</Label>
            <p className="font-medium">
              {formatDate(agendamento.data)} às {formatTime(agendamento.hora)}
            </p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Duração</Label>
            <p className="font-medium">{agendamento.duracao} minutos</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Serviço</Label>
            <p className="font-medium">{agendamento.servico}</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Valor</Label>
            <p className="font-medium text-green-600">{formatCurrency(agendamento.preco)}</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Barbeiro</Label>
            <p className="font-medium">{agendamento.barbeiro}</p>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Status</Label>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[agendamento.status as keyof typeof statusColors]}`}>
              {statusText[agendamento.status as keyof typeof statusText]}
            </span>
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-gray-600">Local</Label>
          <p className="font-medium">{agendamento.barbearia}</p>
          <p className="text-sm text-gray-600">{agendamento.endereco}</p>
        </div>
        
        {agendamento.status === 'concluido' && agendamento.avaliacao && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Sua Avaliação</Label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">{renderStars(agendamento.avaliacao)}</div>
              <span className="text-sm text-gray-600">({agendamento.avaliacao}/5)</span>
            </div>
            {agendamento.comentario && (
              <p className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded-lg">
                "{agendamento.comentario}"
              </p>
            )}
          </div>
        )}
        
        {agendamento.status === 'cancelado' && agendamento.motivoCancelamento && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Motivo do Cancelamento</Label>
            <p className="text-sm text-gray-700">{agendamento.motivoCancelamento}</p>
          </div>
        )}
        
        <div className="flex gap-3 pt-4">
          {agendamento.status === 'concluido' && (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleReagendarServico(agendamento)}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reagendar
              </Button>
              {!agendamento.avaliacao && (
                <Button 
                  variant="outline"
                  onClick={() => handleAvaliarServico(agendamento)}
                  className="flex items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Avaliar
                </Button>
              )}
            </>
          )}
          <Button 
            variant="outline"
            onClick={() => setSelectedAgendamento(null)}
          >
            Fechar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Agendamentos</h1>
          <p className="text-gray-600">
            Acompanhe todos os seus agendamentos passados
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Histórico
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgendamentos}</div>
            <p className="text-xs text-muted-foreground">
              Serviços concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalGasto)}</div>
            <p className="text-xs text-muted-foreground">
              Em serviços realizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-muted-foreground">
              Suas avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por serviço, barbeiro ou barbearia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos ({filteredHistorico.length})</CardTitle>
          <CardDescription>
            Histórico completo dos seus agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistorico.map((agendamento) => (
              <div key={agendamento.id}>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[80px]">
                      <div className="text-sm font-medium">
                        {formatDate(agendamento.data).split(',')[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(agendamento.hora)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{agendamento.servico}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[agendamento.status as keyof typeof statusColors]}`}>
                          {statusText[agendamento.status as keyof typeof statusText]}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Scissors className="h-3 w-3" />
                          <span>com {agendamento.barbeiro}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{agendamento.barbearia}</span>
                        </div>
                      </div>
                      
                      {agendamento.status === 'concluido' && agendamento.avaliacao && (
                        <div className="flex items-center gap-1 mt-2">
                          {renderStars(agendamento.avaliacao)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600 mb-2">
                      {formatCurrency(agendamento.preco)}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedAgendamento(
                        selectedAgendamento?.id === agendamento.id ? null : agendamento
                      )}
                    >
                      {selectedAgendamento?.id === agendamento.id ? 'Ocultar' : 'Ver Detalhes'}
                    </Button>
                  </div>
                </div>
                
                {selectedAgendamento?.id === agendamento.id && renderDetalhesAgendamento(agendamento)}
              </div>
            ))}
          </div>
          
          {filteredHistorico.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus !== 'todos' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Você ainda não possui agendamentos'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}