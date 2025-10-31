import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Database, Clock, TrendingUp, RefreshCw, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { serviceWorkerManager } from '@/utils/serviceWorker';
import { toast } from 'sonner';

interface PerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  networkRequests: number;
  networkFailures: number;
  averageResponseTime: number;
  totalResponseTime: number;
  requestCount: number;
  cacheHitRatio: number;
  networkFailureRate: number;
}

interface NetworkQuality {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export function PWAPerformance({ className }: { className?: string }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>({});
  const [cacheSize, setCacheSize] = useState<number>(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadMetrics();
    loadNetworkInfo();
    
    const interval = setInterval(() => {
      loadMetrics();
      loadNetworkInfo();
    }, 30000); // Update every 30 seconds

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadMetrics = async () => {
    try {
      const performanceMetrics = await serviceWorkerManager.getPerformanceMetrics();
      const size = await serviceWorkerManager.getCacheSize();
      
      setMetrics(performanceMetrics);
      setCacheSize(size);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const loadNetworkInfo = () => {
    const quality = serviceWorkerManager.getNetworkQuality();
    setNetworkQuality(quality);
  };

  const handleResetMetrics = async () => {
    setLoading(true);
    try {
      const success = await serviceWorkerManager.resetPerformanceMetrics();
      if (success) {
        toast.success('Métricas resetadas com sucesso');
        await loadMetrics();
      } else {
        toast.error('Erro ao resetar métricas');
      }
    } catch (error) {
      toast.error('Erro ao resetar métricas');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    setLoading(true);
    try {
      const success = await serviceWorkerManager.clearCaches();
      if (success) {
        toast.success('Cache limpo com sucesso');
        await loadMetrics();
      } else {
        toast.error('Erro ao limpar cache');
      }
    } catch (error) {
      toast.error('Erro ao limpar cache');
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getNetworkTypeColor = (type?: string) => {
    switch (type) {
      case '4g': return 'bg-green-500';
      case '3g': return 'bg-yellow-500';
      case '2g': return 'bg-red-500';
      case 'slow-2g': return 'bg-red-700';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceScore = () => {
    if (!metrics) return 0;
    
    const cacheScore = metrics.cacheHitRatio || 0;
    const networkScore = 100 - (metrics.networkFailureRate || 0);
    const speedScore = metrics.averageResponseTime < 1000 ? 100 : 
                      metrics.averageResponseTime < 2000 ? 75 : 
                      metrics.averageResponseTime < 3000 ? 50 : 25;
    
    return Math.round((cacheScore + networkScore + speedScore) / 3);
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Performance PWA</h2>
            <p className="text-muted-foreground">
              Monitoramento e métricas de performance da aplicação
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadMetrics} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={handleResetMetrics} variant="outline" size="sm" disabled={loading}>
              Resetar Métricas
            </Button>
            <Button onClick={handleClearCache} variant="destructive" size="sm" disabled={loading}>
              Limpar Cache
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="network">Rede</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Performance Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Score de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-green-600">
                    {getPerformanceScore()}
                  </div>
                  <div className="flex-1">
                    <Progress value={getPerformanceScore()} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Score baseado em cache, rede e velocidade de resposta
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div className="text-sm font-medium">Status</div>
                  </div>
                  <div className="mt-2">
                    <Badge variant={isOnline ? "default" : "destructive"}>
                      {isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-green-500" />
                    <div className="text-sm font-medium">Cache</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-bold">{formatBytes(cacheSize)}</div>
                    <div className="text-xs text-muted-foreground">Tamanho total</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <div className="text-sm font-medium">Resposta</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-bold">
                      {metrics?.averageResponseTime?.toFixed(0) || 0}ms
                    </div>
                    <div className="text-xs text-muted-foreground">Tempo médio</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <div className="text-sm font-medium">Requisições</div>
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-bold">{metrics?.requestCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div