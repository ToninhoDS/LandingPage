import React, { useState } from 'react'
import { ShoppingCart, Plus, Search, Filter, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import TouchButton from '@/components/mobile/TouchButton'
import SwipeableCard from '@/components/mobile/SwipeableCard'

// Mock data
const produtos = [
  {
    id: 1,
    nome: 'Pomada Modeladora Premium',
    preco: 45.90,
    categoria: 'Cabelo',
    descricao: 'Pomada de alta fixação para cabelos masculinos',
    imagem: '🧴',
    rating: 4.8,
    estoque: 15,
    promocao: false
  },
  {
    id: 2,
    nome: 'Óleo para Barba Artesanal',
    preco: 32.50,
    categoria: 'Barba',
    descricao: 'Óleo hidratante com essências naturais',
    imagem: '🛢️',
    rating: 4.9,
    estoque: 8,
    promocao: true,
    precoOriginal: 42.50
  },
  {
    id: 3,
    nome: 'Shampoo Anticaspa',
    preco: 28.90,
    categoria: 'Cabelo',
    descricao: 'Shampoo especializado para cabelos oleosos',
    imagem: '🧴',
    rating: 4.6,
    estoque: 22,
    promocao: false
  },
  {
    id: 4,
    nome: 'Kit Barbear Completo',
    preco: 89.90,
    categoria: 'Barba',
    descricao: 'Kit com navalha, pincel e sabão de barbear',
    imagem: '🪒',
    rating: 4.7,
    estoque: 5,
    promocao: true,
    precoOriginal: 120.00
  }
]

const categorias = ['Todos', 'Cabelo', 'Barba', 'Cuidados']

export default function Produtos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [cart, setCart] = useState<{[key: number]: number}>({})

  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || produto.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (produtoId: number) => {
    setCart(prev => ({
      ...prev,
      [produtoId]: (prev[produtoId] || 0) + 1
    }))
  }

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [id, quantity]) => {
      const produto = produtos.find(p => p.id === parseInt(id))
      return total + (produto?.preco || 0) * quantity
    }, 0)
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Produtos</h1>
          <div className="relative">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {getCartItemCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {getCartItemCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categorias.map(categoria => (
            <TouchButton
              key={categoria}
              variant={selectedCategory === categoria ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(categoria)}
              className="whitespace-nowrap"
            >
              {categoria}
            </TouchButton>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 space-y-4">
        {filteredProdutos.map(produto => (
          <SwipeableCard key={produto.id}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{produto.imagem}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg leading-tight">
                          {produto.nome}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {produto.descricao}
                        </p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{produto.rating}</span>
                          </div>
                          <Badge variant="secondary">{produto.categoria}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {produto.estoque} em estoque
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-col">
                        {produto.promocao && (
                          <span className="text-sm text-muted-foreground line-through">
                            R$ {produto.precoOriginal?.toFixed(2)}
                          </span>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-primary">
                            R$ {produto.preco.toFixed(2)}
                          </span>
                          {produto.promocao && (
                            <Badge variant="destructive" className="text-xs">
                              OFERTA
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {cart[produto.id] && (
                          <Badge variant="outline">
                            {cart[produto.id]}x
                          </Badge>
                        )}
                        <TouchButton
                          size="sm"
                          onClick={() => addToCart(produto.id)}
                          disabled={produto.estoque === 0}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Adicionar
                        </TouchButton>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwipeableCard>
        ))}
      </div>

      {/* Cart Summary */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-16 left-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">
                {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'itens'}
              </span>
              <div className="text-lg font-bold">
                R$ {getCartTotal().toFixed(2)}
              </div>
            </div>
            <TouchButton variant="secondary">
              Finalizar Compra
            </TouchButton>
          </div>
        </div>
      )}
    </div>
  )
}