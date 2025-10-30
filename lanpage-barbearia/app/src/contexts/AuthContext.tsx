import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Usuario } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  userProfile: Usuario | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: Partial<Usuario>) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Usuario>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<Usuario | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, userData: Partial<Usuario>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) return { error }

    // Criar perfil do usuário
    if (data.user) {
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            ...userData,
          },
        ])

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        return { error: profileError }
      }
    }

    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (data: Partial<Usuario>) => {
    if (!user) return { error: new Error('Usuário não autenticado') }

    const { error } = await supabase
      .from('usuarios')
      .update(data)
      .eq('id', user.id)

    if (!error) {
      await fetchUserProfile(user.id)
    }

    return { error }
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}