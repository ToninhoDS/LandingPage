import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  User, 
  History, 
  Bell, 
  LogOut, 
  Scissors,
  Menu,
  X,
  Download,
  Wifi,
  WifiOff,
  MessageCircle,
  Settings,
  BarChart3,
  Users,
  Package,
  Zap,
  Clock
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/contexts/AuthContext'
import { usePWA } from '@/hooks/usePWA'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ProtectedComponent from '@/components/ProtectedComponent'

// Navigation for different user types - Mobile-First Design
const clientNavigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Agendar', href: '/agendamento', icon: Calendar },
  { name: 'Histórico', href: '/historico', icon: History },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Perfil', href: '/perfil', icon: User },
]

const barbeiroNavigation = [
  { name: 'Agenda', href: '/dashboard', icon: Calendar },
  { name: 'Próximos', href: '/proximos', icon: Clock },
  { name: 'Ganhos', href: '/ganhos', icon: BarChart3 },
  { name: 'Histórico', href: '/historico', icon: History },
  { name: 'Perfil', href: '/perfil', icon: User },
]

const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Gestão', href: '/gestao', icon: Users },
  { name: 'Relatórios', href: '/relatorios', icon: Package },
  { name: 'Integrações', href: '/integracoes', icon: Zap },
  { name: 'Config', href: '/configuracoes', icon: Settings },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userProfile, signOut } = useAuth()
  const { isInstallable, isOnline, installApp } = usePWA()
  const { canAccessRoute } = useRoleAccess()
  const location = useLocation()
  const navigate = useNavigate()

  // Determine navigation based on user type
  const getNavigation = () => {
    switch (userProfile?.tipo) {
      case 'barbeiro':
        return barbeiroNavigation
      case 'admin':
        return adminNavigation
      default:
        return clientNavigation
    }
  }

  const navigation = getNavigation()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso!')
      navigate('/login')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between lg:hidden">
        <div className="flex items-center space-x-2">
          <div className="bg-primary rounded-full p-2">
            <Scissors className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">Barbearia Pro</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Online/Offline Status */}
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/notificacoes')}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Button>
          
          {/* Menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r shadow-sm">
          <div className="flex items-center space-x-2 p-6 border-b">
            <div className="bg-primary rounded-full p-2">
              <Scissors className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Barbearia Pro</span>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              )
            })}
          </nav>

          <div className="p-4 border-t space-y-3">
            {/* Online/Offline Status */}
            <div className="flex items-center space-x-2 text-xs">
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-500" />
                  <span className="text-red-600">Offline</span>
                </>
              )}
            </div>

            {/* Install App Button */}
            {isInstallable && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={installApp}
              >
                <Download className="h-4 w-4 mr-2" />
                Instalar App
              </Button>
            )}

            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-full p-2">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {userProfile?.nome || 'Usuário'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userProfile?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed right-0 top-0 h-full w-80 bg-card border-l shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* User Profile */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-full p-3">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium truncate">
                  {userProfile?.nome || 'Usuário'}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {userProfile?.email}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userProfile?.tipo || 'cliente'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Menu Items */}
          <nav className="p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate('/notificacoes')
                setSidebarOpen(false)
              }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notificações
            </Button>
            
            <ProtectedComponent requiredPermission="canManageIntegrations">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/integracoes')
                  setSidebarOpen(false)
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                Integrações
              </Button>
            </ProtectedComponent>
            
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                navigate('/configuracoes')
                setSidebarOpen(false)
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>

            {/* Install App Button */}
            {isInstallable && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  installApp()
                  setSidebarOpen(false)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Instalar App
              </Button>
            )}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pl-64 pb-16 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-40">
        <div className="flex">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-2 px-1 min-h-[60px]",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="text-xs font-medium truncate">
                  {item.name}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}