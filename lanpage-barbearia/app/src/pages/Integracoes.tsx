import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  Workflow, 
  Brain,
  Bell,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TouchButton from '@/components/mobile/TouchButton';
import WhatsAppConfig from '@/components/admin/WhatsAppConfig';
import GoogleCalendarConfig from '@/components/admin/GoogleCalendarConfig';
import N8NConfig from '@/components/admin/N8NConfig';
import AIConfig from '@/components/admin/AIConfig';
import NotificationManager from '@/components/admin/NotificationManager';
import { supabase } from '@/lib/supabase';
import { useWhatsAppNotifications } from '@/hooks/useWhatsAppNotifications';
import { useGoogleCalendarSync } from '@/hooks/useGoogleCalendarSync';

// Mock barbearia ID - em produção, isso viria do contexto de autenticação
const BARBEARIA_ID = '123e4567-e89b-12d3-a456-426614174000';

interface IntegracaoStatus {
  tipo: string;
  nome: string;
  descricao: string;
  icon: React.ReactNode;
  ativo: boolean;
  configurado: boolean;
  ultimaAtualizacao?: string;
}

export default function Integracoes() {
  const navigate = useNavigate();
  const [integracoes, setIntegracoes] = useState<IntegracaoStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('whatsapp');

  // Hooks para as integrações
  useWhatsAppNotifications(BARBEARIA_ID);
  useGoogleCalendarSync(BARBEARIA_ID);

  useEffect(() => {
    loadIntegracoes();
  }, []);

  const loadIntegracoes = async () => {
    try {
      const { data: integracoesData } = await supabase
        .from('integracoes')
        .select('tipo, ativo, updated_at')
        .eq('barbearia_id', BARBEARIA_ID);

      const integracoesMap = new Map(
        integracoesData?.map(i => [i.tipo, i]) || []
      );

      const integracoesStatus: IntegracaoStatus[] = [
        {
          tipo: 'whatsapp',
          nome: 'WhatsApp Business',
          descricao: 'Envio automático de confirmações, lembretes e promoções',
          icon: <MessageSquare className="h-6 w-6 text-green-600" />,
          ativo: integracoesMap.get('whatsapp')?.ativo || false,
          configurado: integracoesMap.has('whatsapp'),
          ultimaAtualizacao: integracoesMap.get('whatsapp')?.updated_at,
        },
        {
          tipo: 'google_calendar',
          nome: 'Google Calendar',
          descricao: 'Sincronização bidirecional de agendamentos',
          icon: <Calendar className="h-6 w-6 text-blue-600" />,
          ativo: integracoesMap.get('google_calendar')?.ativo || false,
          configurado: integracoesMap.has('google_calendar'),
          ultimaAtualizacao: integracoesMap.get('google_calendar')?.updated_at,
        },
        {
          tipo: 'n8n',
          nome: 'N8N Workflows',
          descricao: 'Automação avançada de processos e integrações',
          icon: <Workflow className="h-6 w-6 text-purple-600" />,
          ativo: integracoesMap.get('n8n')?.ativo || false,
          configurado: integracoesMap.has('n8n'),
          ultimaAtualizacao: integracoesMap.get('n8n')?.updated_at,
        },
        {
          tipo: 'openai',
          nome: 'Agentes de IA',
          descricao: 'Atendimento automatizado e assistente virtual',
          icon: <Brain className="h-6 w-6 text-orange-600" />,
          ativo: integracoesMap.get('openai')?.ativo || false,
          configurado: integracoesMap.has('openai'),
          ultimaAtualizacao: integracoesMap.get('openai')?.updated_at,
        },
        {
          tipo: 'push_notifications',
          nome: 'Push Notifications',
          descricao: 'Notificações push para engajamento de clientes',
          icon: <Bell className="h-6 w-6 text-red-600" />,
          ativo: integracoesMap.get('push_notifications')?.ativo || false,
          configurado: integracoesMap.has('push_notifications'),
          ultimaAtualizacao: integracoesMap.get('push_notifications')?.updated_at,
        },
      ];

      setIntegracoes(integracoesStatus);
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (integracao: IntegracaoStatus) => {
    if (!integracao.configurado) {
      return (
        <Badge variant="outline" className="text-gray-600">
          <XCircle className="h-3 w-3 mr-1" />
          Não Configurado
        </Badge>
      );
    }

    if (integracao.ativo) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Ativo
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-yellow-600">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Inativo
      </Badge>
    );
  };

  const formatLastUpdate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando integrações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3 mb-2">
          <TouchButton
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </TouchButton>
          <h1 className="text-xl font-bold">Integrações</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm">
          Configure e gerencie suas integrações externas
        </p>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="n8n">N8N</TabsTrigger>
              <TabsTrigger value="ai">IA</TabsTrigger>
              <TabsTrigger value="notifications">Push</TabsTrigger>
            </TabsList>

          <TabsContent value="whatsapp" className="mt-6">
            <WhatsAppConfig />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <GoogleCalendarConfig />
          </TabsContent>

          <TabsContent value="n8n" className="mt-6">
              <N8NConfig />
            </TabsContent>

            <TabsContent value="ai" className="mt-6">
              <AIConfig />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <NotificationManager />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}