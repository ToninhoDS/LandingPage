import React, { useState } from 'react';
import { Settings, User, Bell, Smartphone, Shield, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PWASettings from '@/components/PWASettings';
import { toast } from 'sonner';

const Configuracoes = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pwa');

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-gray-400">Gerencie suas preferências e configurações do app</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border-gray-700">
            <TabsTrigger 
              value="pwa" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              PWA
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger 
              value="account"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Conta
            </TabsTrigger>
            <TabsTrigger 
              value="privacy"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Privacidade
            </TabsTrigger>
          </TabsList>

          {/* PWA Settings Tab */}
          <TabsContent value="pwa" className="mt-6">
            <PWASettings />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <Card className="bg-gray-800/50 border-gray-700 p-6">
              <h3 className="text-white font-semibold mb-4">Configurações de Notificação</h3>
              <p className="text-gray-400 mb-4">
                Para configurações detalhadas de notificação, acesse a página de notificações.
              </p>
              <Button 
                onClick={() => navigate('/notificacoes')}
                className="w-full"
              >
                <Bell className="h-4 w-4 mr-2" />
                Ir para Notificações
              </Button>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h3 className="text-white font-semibold mb-4">Informações da Conta</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm">Email</label>
                    <p className="text-white">{user?.email || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Nome</label>
                    <p className="text-white">{user?.user_metadata?.name || 'Não informado'}</p>
                  </div>
                  <Button 
                    onClick={() => navigate('/perfil')}
                    variant="outline"
                    className="w-full"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h3 className="text-white font-semibold mb-4">Ações da Conta</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair da Conta
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h3 className="text-white font-semibold mb-4">Privacidade e Segurança</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Dados de Agendamento</h4>
                      <p className="text-gray-400 text-sm">Seus agendamentos são privados e seguros</p>
                    </div>
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Criptografia</h4>
                      <p className="text-gray-400 text-sm">Todos os dados são criptografados</p>
                    </div>
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Compartilhamento</h4>
                      <p className="text-gray-400 text-sm">Não compartilhamos seus dados</p>
                    </div>
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700 p-6">
                <h3 className="text-white font-semibold mb-4">Ajuda e Suporte</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Central de Ajuda
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Termos de Uso
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Política de Privacidade
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuracoes;