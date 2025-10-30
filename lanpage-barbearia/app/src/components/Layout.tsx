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
  MessageCircle
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/contexts/AuthContext'
import { usePWA } from '@/hooks/usePWA'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Agendamento', href: '/agendamento', icon: Calendar },
  { name: 'Histórico', href: '/historico', icon: History },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Perfil', href: '/perfil', icon: User },
  { name: 'Notificações', href: '/notificacoes', icon: Bell },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userProfile, signOut } = useAuth()
  const { isInstallable, isOnline, installApp } = usePWA()
  const location = useLocation()
  const navigate = useNavigate()

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
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-card border-r shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="bg-primary rounded-full p-2">
                <Scissors className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">Barbearia</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(item.href)
                    setSidebarOpen(false)
                  }}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              )
            })}
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

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r shadow-sm">
          <div className="flex items-center space-x-2 p-6 border-b">
            <div className="bg-primary rounded-full p-2">
              <Scissors className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Barbearia</span>
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

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-full p-1">
              <Scissors className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Barbearia</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}