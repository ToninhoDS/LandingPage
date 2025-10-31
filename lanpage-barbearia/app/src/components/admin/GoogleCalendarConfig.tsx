import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TouchButton from '@/components/mobile/TouchButton';
import { Calendar, Settings, TestTube, RefreshCw, RotateCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useGoogleCalendarSync } from '@/hooks/useGoogleCalendarSync';
import { toast } from 'sonner';
import { googleCalendarService, SyncResult, SyncConflict } from '@/services/googleCalendar';

interface GoogleCalendarConfigProps {
  barbeariaId: string;
}

export function GoogleCalendarConfig({ barbeariaId }: GoogleCalendarConfigProps) {
  const [config, setConfig] = useState({
    apiKey: '',
    calendarId: '',
    clientId: '',
    accessToken: '',
    refreshToken: '',
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncStats, setSyncStats] = useState({ sucessos: 0, falhas: 0, total: 0 });
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [conflicts, setConflicts] = useState<SyncConflict[]>([]);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [calendars, setCalendars] = useState<any[]>([]);

  const { syncAllAppointments, testCalendarConnection } = useGoogleCalendarSync(barbeariaId);

  const handleSyncCalendar = async () => {
    setSyncInProgress(true);
    try {
      const result = await googleCalendarService.syncAppointments(barbeariaId, calendarId);
      setSyncResult(result);
      setConflicts(result.conflicts);
      setLastSyncTime(new Date().toLocaleString('pt-BR'));
      
      if (result.conflicts.length > 0) {
        toast.warning(`Sincronização concluída com ${result.conflicts.length} conflitos`);
      } else {
        toast.success('Sincronização concluída com sucesso!');
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast.error('Erro durante a sincronização');
    } finally {
      setSyncInProgress(false);
    }
  };

  const handleResolveConflict = async (
    conflict: SyncConflict,
    resolution: 'keep_local' | 'keep_remote' | 'merge'
  ) => {
    try {
      await googleCalendarService.resolveConflict(conflict, resolution);
      setConflicts(prev => prev.filter(c => c !== conflict));
      toast.success('Conflito resolvido com sucesso!');
    } catch (error) {
      console.error('Erro ao resolver conflito:', error);
      toast.error('Erro ao resolver conflito');
    }
  };

  const loadCalendarList = async () => {
    try {
      const calendarList = await googleCalendarService.getCalendarList();
      setCalendars(calendarList);
    } catch (error) {
      console.error('Erro ao carregar calendários:', error);
    }
  };

  useEffect(() => {
    loadConfiguration();
  }, [barbeariaId]);

  useEffect(() => {
    if (accessToken && barbeariaId) {
      loadCalendarList();
    }
  }, [accessToken, barbeariaId]);

  const loadConfiguration = async () => {
    try {
      const { data } = await supabase
        .from('integracoes')
        .select('configuracao, ativo')
        .eq('barbearia_id', barbeariaId)
        .eq('tipo', 'google_calendar')
        .single();

      if (data) {
        setConfig(data.configuracao);
        setIsConfigured(data.ativo);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const saveConfiguration = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('integracoes')
        .upsert({
          barbearia_id: barbeariaId,
          tipo: 'google_calendar',
          configuracao: config,
          ativo: true,
        });

      if (error) throw error;

      setIsConfigured(true);
      toast.success('Configuração do Google Calendar salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração do Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const success = await testCalendarConnection();
      
      if (success) {
        toast.success('Conexão com Google Calendar testada com sucesso!');
      } else {
        toast.error('Falha ao testar conexão com Google Calendar');
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      toast.error('Erro ao testar Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  const syncAppointments = async () => {
    setLoading(true);
    try {
      const result = await syncAllAppointments();
      setSyncStats(result);
      
      if (result.falhas === 0) {
        toast.success(`${result.sucessos} agendamentos sincronizados com sucesso!`);
      } else {
        toast.warning(`${result.sucessos} sucessos, ${result.falhas} falhas na sincronização`);
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast.error('Erro ao sincronizar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const initiateOAuthFlow = () => {
    const scopes = 'https://www.googleapis.com/auth/calendar';
    const redirectUri = `${window.location.origin}/oauth/google-calendar`;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${config.clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scopes}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.open(authUrl, 'google-oauth', 'width=500,height=600');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Configuração Google Calendar</h2>
        {isConfigured && (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Configurado
          </Badge>
        )}
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Configuração
          </TabsTrigger>
          <TabsTrigger value="sync">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronização
          </TabsTrigger>
          <TabsTrigger value="test">
            <TestTube className="h-4 w-4 mr-2" />
            Teste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="Chave da API do Google Calendar"
                />
              </div>

              <div>
                <Label htmlFor="calendarId">Calendar ID</Label>
                <Input
                  id="calendarId"
                  value={config.calendarId}
                  onChange={(e) => setConfig({ ...config, calendarId: e.target.value })}
                  placeholder="ID do calendário (ex: primary ou email@gmail.com)"
                />
              </div>

              <div>
                <Label htmlFor="clientId">Client ID</Label>
                <Input
                  id="clientId"
                  value={config.clientId}
                  onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                  placeholder="Client ID do Google Cloud Console"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accessToken">Access Token</Label>
                  <Input
                    id="accessToken"
                    type="password"
                    value={config.accessToken}
                    onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                    placeholder="Token de acesso OAuth"
                  />
                </div>

                <div>
                  <Label htmlFor="refreshToken">Refresh Token</Label>
                  <Input
                    id="refreshToken"
                    type="password"
                    value={config.refreshToken}
                    onChange={(e) => setConfig({ ...config, refreshToken: e.target.value })}
                    placeholder="Token de renovação OAuth"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <TouchButton
                  onClick={saveConfiguration}
                  loading={loading}
                  className="flex-1"
                >
                  Salvar Configuração
                </TouchButton>

                <TouchButton
                  onClick={initiateOAuthFlow}
                  variant="outline"
                  disabled={!config.clientId}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  OAuth
                </TouchButton>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50">
            <h3 className="font-medium mb-2">Como configurar:</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Acesse o Google Cloud Console</li>
              <li>2. Crie um projeto e ative a Calendar API</li>
              <li>3. Configure as credenciais OAuth 2.0</li>
              <li>4. Obtenha a API Key e Client ID</li>
              <li>5. Use o botão OAuth para autorizar o acesso</li>
            </ol>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Sincronização de Agendamentos</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{syncStats.sucessos}</div>
                  <div className="text-sm text-gray-600">Sucessos</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{syncStats.falhas}</div>
                  <div className="text-sm text-gray-600">Falhas</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{syncStats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>

              <TouchButton
                onClick={syncAppointments}
                loading={loading}
                disabled={!isConfigured}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Sincronizar Todos os Agendamentos
              </TouchButton>

              {!isConfigured && (
                <p className="text-sm text-amber-600">
                  Configure o Google Calendar primeiro para poder sincronizar
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-yellow-50">
            <h3 className="font-medium mb-2">Sincronização Automática</h3>
            <p className="text-sm text-gray-600">
              Novos agendamentos são automaticamente sincronizados com o Google Calendar.
              Use a sincronização manual apenas para agendamentos existentes que ainda não foram sincronizados.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-medium mb-4">Teste de Conexão</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Este teste criará um evento temporário no seu calendário e o removerá em seguida
                para verificar se a integração está funcionando corretamente.
              </p>

              <TouchButton
                onClick={testConnection}
                loading={loading}
                disabled={!isConfigured}
                className="w-full"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Testar Conexão
              </TouchButton>

              {!isConfigured && (
                <p className="text-sm text-amber-600">
                  Configure o Google Calendar primeiro para poder testar
                </p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default GoogleCalendarConfig;