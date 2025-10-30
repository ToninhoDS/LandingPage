import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

export default function Perfil() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: profile?.nome || '',
    telefone: profile?.telefone || '',
    whatsapp: profile?.whatsapp || '',
    endereco: profile?.endereco || '',
    data_nascimento: profile?.data_nascimento || ''
  });

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: profile?.nome || '',
      telefone: profile?.telefone || '',
      whatsapp: profile?.whatsapp || '',
      endereco: profile?.endereco || '',
      data_nascimento: profile?.data_nascimento || ''
    });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    // Implementar confirmação e exclusão da conta
    toast.error('Funcionalidade em desenvolvimento');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Suas informações básicas de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        O e-mail não pode ser alterado
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                      placeholder="Rua, número, bairro, cidade"
                    />
                  </div>

                  <div>
                    <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                    <Input
                      id="data_nascimento"
                      type="date"
                      value={formData.data_nascimento}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Alterações
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Nome</Label>
                      <p className="font-medium">{profile?.nome || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">E-mail</Label>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                      <p className="font-medium">{profile?.telefone || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">WhatsApp</Label>
                      <p className="font-medium">{profile?.whatsapp || 'Não informado'}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Endereço</Label>
                    <p className="font-medium">{profile?.endereco || 'Não informado'}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">Data de Nascimento</Label>
                    <p className="font-medium">
                      {profile?.data_nascimento ? formatDate(profile.data_nascimento) : 'Não informado'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências
              </CardTitle>
              <CardDescription>
                Configure suas preferências de notificação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por E-mail</p>
                  <p className="text-sm text-gray-600">
                    Receber confirmações e lembretes por e-mail
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Ativado
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações WhatsApp</p>
                  <p className="text-sm text-gray-600">
                    Receber lembretes via WhatsApp
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Ativado
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ofertas e Promoções</p>
                  <p className="text-sm text-gray-600">
                    Receber ofertas especiais e promoções
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Desativado
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Foto do Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Foto do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Alterar Foto
              </Button>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Agendamentos</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cliente desde</span>
                <span className="font-bold">Jan 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última visita</span>
                <span className="font-bold">15 Jan</span>
              </div>
            </CardContent>
          </Card>

          {/* Ações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Alterar Senha
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={signOut}>
                Sair da Conta
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}