import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  UserCheck, 
  UserX, 
  Edit3, 
  Save, 
  X,
  Crown,
  Scissors,
  User
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TouchButton from '@/components/mobile/TouchButton';
import SwipeableCard from '@/components/mobile/SwipeableCard';
import { toast } from 'sonner';

interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  tipo: 'cliente' | 'barbeiro' | 'admin';
  ativo: boolean;
  created_at: string;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    tipo: 'cliente',
    ativo: true,
    created_at: '2024-01-10'
  },
  {
    id: '2',
    nome: 'Pedro Santos',
    email: 'pedro@barbearia.com',
    telefone: '(11) 88888-8888',
    tipo: 'barbeiro',
    ativo: true,
    created_at: '2024-01-05'
  },
  {
    id: '3',
    nome: 'Maria Costa',
    email: 'maria@email.com',
    telefone: '(11) 77777-7777',
    tipo: 'cliente',
    ativo: false,
    created_at: '2024-01-08'
  },
  {
    id: '4',
    nome: 'Carlos Admin',
    email: 'carlos@barbearia.com',
    telefone: '(11) 66666-6666',
    tipo: 'admin',
    ativo: true,
    created_at: '2024-01-01'
  }
];

const roleIcons = {
  cliente: User,
  barbeiro: Scissors,
  admin: Crown
};

const roleColors = {
  cliente: 'bg-blue-100 text-blue-800',
  barbeiro: 'bg-green-100 text-green-800',
  admin: 'bg-purple-100 text-purple-800'
};

const roleLabels = {
  cliente: 'Cliente',
  barbeiro: 'Barbeiro',
  admin: 'Administrador'
};

export default function RoleManager() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleEditUser = (user: User) => {
    setEditingUser(user.id);
    setEditForm(user);
  };

  const handleSaveUser = async () => {
    if (!editingUser || !editForm) return;

    try {
      setUsers(users.map(user => 
        user.id === editingUser 
          ? { ...user, ...editForm }
          : user
      ));
      
      setEditingUser(null);
      setEditForm({});
      toast.success('Usuário atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar usuário');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, ativo: !user.ativo }
          : user
      ));
      
      const user = users.find(u => u.id === userId);
      toast.success(`Usuário ${user?.ativo ? 'desativado' : 'ativado'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status do usuário');
    }
  };

  const filteredUsers = users.filter(user => {
    const roleMatch = filterRole === 'all' || user.tipo === filterRole;
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'active' && user.ativo) ||
      (filterStatus === 'inactive' && !user.ativo);
    
    return roleMatch && statusMatch;
  });

  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.ativo).length;
    const byRole = {
      cliente: users.filter(u => u.tipo === 'cliente').length,
      barbeiro: users.filter(u => u.tipo === 'barbeiro').length,
      admin: users.filter(u => u.tipo === 'admin').length
    };
    
    return { total, active, byRole };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Gerenciamento de Usuários
          </h2>
          <p className="text-sm text-muted-foreground">
            Gerencie roles e permissões dos usuários
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SwipeableCard className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </SwipeableCard>

        <SwipeableCard className="p-4">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Ativos</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </SwipeableCard>

        <SwipeableCard className="p-4">
          <div className="flex items-center space-x-2">
            <Scissors className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">Barbeiros</p>
              <p className="text-2xl font-bold">{stats.byRole.barbeiro}</p>
            </div>
          </div>
        </SwipeableCard>

        <SwipeableCard className="p-4">
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium">Admins</p>
              <p className="text-2xl font-bold">{stats.byRole.admin}</p>
            </div>
          </div>
        </SwipeableCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="role-filter">Filtrar por Role</Label>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os roles</SelectItem>
              <SelectItem value="cliente">Clientes</SelectItem>
              <SelectItem value="barbeiro">Barbeiros</SelectItem>
              <SelectItem value="admin">Administradores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label htmlFor="status-filter">Filtrar por Status</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => {
          const RoleIcon = roleIcons[user.tipo];
          const isEditing = editingUser === user.id;

          return (
            <SwipeableCard key={user.id} className="p-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        value={editForm.nome || ''}
                        onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={editForm.telefone || ''}
                        onChange={(e) => setEditForm({ ...editForm, telefone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo">Role</Label>
                      <Select 
                        value={editForm.tipo} 
                        onValueChange={(value) => setEditForm({ ...editForm, tipo: value as User['tipo'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cliente">Cliente</SelectItem>
                          <SelectItem value="barbeiro">Barbeiro</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <TouchButton onClick={handleSaveUser} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </TouchButton>
                    <TouchButton variant="outline" onClick={handleCancelEdit} size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </TouchButton>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 rounded-full p-2">
                      <RoleIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{user.nome}</h3>
                        <Badge className={roleColors[user.tipo]}>
                          {roleLabels[user.tipo]}
                        </Badge>
                        <Badge variant={user.ativo ? 'default' : 'secondary'}>
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.telefone && (
                        <p className="text-xs text-muted-foreground">{user.telefone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TouchButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </TouchButton>
                    <TouchButton
                      variant={user.ativo ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.ativo ? (
                        <UserX className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </TouchButton>
                  </div>
                </div>
              )}
            </SwipeableCard>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum usuário encontrado com os filtros aplicados</p>
        </div>
      )}
    </div>
  );
}