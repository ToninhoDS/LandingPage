import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Share2, 
  Calendar, 
  Image, 
  FileText, 
  ArrowLeft,
  Download,
  Send,
  Copy
} from 'lucide-react';
import TouchButton from '@/components/mobile/TouchButton';

interface SharedData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export default function Share() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sharedData, setSharedData] = useState<SharedData>({});
  const [processing, setProcessing] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    // Extract shared data from URL parameters
    const title = searchParams.get('title');
    const text = searchParams.get('text');
    const url = searchParams.get('url');
    
    setSharedData({
      title: title || undefined,
      text: text || undefined,
      url: url || undefined
    });

    // Try to parse shared data for appointment information
    if (text) {
      parseSharedText(text);
    }
  }, [searchParams]);

  // Parse shared text to extract appointment information
  const parseSharedText = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Try to extract service type
    if (lowerText.includes('corte') && lowerText.includes('barba')) {
      setAppointmentData(prev => ({ ...prev, service: 'Corte + Barba' }));
    } else if (lowerText.includes('corte')) {
      setAppointmentData(prev => ({ ...prev, service: 'Corte' }));
    } else if (lowerText.includes('barba')) {
      setAppointmentData(prev => ({ ...prev, service: 'Barba' }));
    }

    // Try to extract date/time information
    const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}-\d{1,2}-\d{4})/;
    const timeRegex = /(\d{1,2}:\d{2})/;
    
    const dateMatch = text.match(dateRegex);
    const timeMatch = text.match(timeRegex);
    
    if (dateMatch) {
      const dateStr = dateMatch[1].replace(/\//g, '-');
      setAppointmentData(prev => ({ ...prev, date: dateStr }));
    }
    
    if (timeMatch) {
      setAppointmentData(prev => ({ ...prev, time: timeMatch[1] }));
    }

    // Set the original text as notes
    setAppointmentData(prev => ({ ...prev, notes: text }));
  };

  // Handle file processing
  const processFiles = async (files: File[]) => {
    setProcessing(true);
    
    try {
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          // Process image files
          await processImageFile(file);
        } else if (file.type === 'text/calendar' || file.name.endsWith('.ics')) {
          // Process calendar files
          await processCalendarFile(file);
        }
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Erro ao processar arquivos');
    } finally {
      setProcessing(false);
    }
  };

  // Process image files
  const processImageFile = async (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        // Here you could implement image analysis or just store the image
        toast.success(`Imagem ${file.name} processada`);
        resolve(imageUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  // Process calendar files
  const processCalendarFile = async (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const icsContent = e.target?.result as string;
        
        // Parse ICS content for appointment data
        const lines = icsContent.split('\n');
        let summary = '';
        let dtstart = '';
        let description = '';
        
        lines.forEach(line => {
          if (line.startsWith('SUMMARY:')) {
            summary = line.replace('SUMMARY:', '').trim();
          } else if (line.startsWith('DTSTART:')) {
            dtstart = line.replace('DTSTART:', '').trim();
          } else if (line.startsWith('DESCRIPTION:')) {
            description = line.replace('DESCRIPTION:', '').trim();
          }
        });

        if (summary) {
          setAppointmentData(prev => ({ ...prev, service: summary }));
        }
        
        if (dtstart) {
          // Parse DTSTART format (YYYYMMDDTHHMMSS)
          const year = dtstart.substring(0, 4);
          const month = dtstart.substring(4, 6);
          const day = dtstart.substring(6, 8);
          const hour = dtstart.substring(9, 11);
          const minute = dtstart.substring(11, 13);
          
          setAppointmentData(prev => ({
            ...prev,
            date: `${year}-${month}-${day}`,
            time: `${hour}:${minute}`
          }));
        }
        
        if (description) {
          setAppointmentData(prev => ({ ...prev, notes: description }));
        }

        toast.success('Evento de calendário importado');
        resolve(icsContent);
      };
      reader.readAsText(file);
    });
  };

  // Create appointment from shared data
  const createAppointment = () => {
    if (!appointmentData.service) {
      toast.error('Selecione um serviço');
      return;
    }

    // Navigate to appointment page with pre-filled data
    const params = new URLSearchParams();
    if (appointmentData.service) params.set('service', appointmentData.service);
    if (appointmentData.date) params.set('date', appointmentData.date);
    if (appointmentData.time) params.set('time', appointmentData.time);
    if (appointmentData.notes) params.set('notes', appointmentData.notes);

    navigate(`/agendamento?${params.toString()}`);
  };

  // Copy shared content
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copiado para a área de transferência');
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  // Share content
  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sharedData.title || 'Barbearia App',
          text: sharedData.text || 'Confira este agendamento',
          url: sharedData.url || window.location.origin
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      const content = `${sharedData.title || ''}\n${sharedData.text || ''}\n${sharedData.url || ''}`.trim();
      await copyToClipboard(content);
    }
  };

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
          <h1 className="text-xl font-bold">Conteúdo Compartilhado</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm">
          Processe e gerencie conteúdo compartilhado
        </p>
      </div>

      <div className="p-4 space-y-6">
        {/* Shared Data Display */}
        {(sharedData.title || sharedData.text || sharedData.url) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Dados Compartilhados
              </CardTitle>
              <CardDescription>
                Informações recebidas através do compartilhamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sharedData.title && (
                <div>
                  <Label className="text-sm font-medium">Título</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={sharedData.title} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(sharedData.title!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {sharedData.text && (
                <div>
                  <Label className="text-sm font-medium">Texto</Label>
                  <div className="flex items-start gap-2 mt-1">
                    <Textarea value={sharedData.text} readOnly rows={3} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(sharedData.text!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {sharedData.url && (
                <div>
                  <Label className="text-sm font-medium">URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={sharedData.url} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(sharedData.url!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={shareContent} variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointment Creation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Criar Agendamento
            </CardTitle>
            <CardDescription>
              Use os dados compartilhados para criar um agendamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="service">Serviço</Label>
              <Input
                id="service"
                value={appointmentData.service}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, service: e.target.value }))}
                placeholder="Ex: Corte + Barba"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={appointmentData.date}
                  onChange={(e) => setAppointmentData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={appointmentData.time}
                  onChange={(e) => setAppointmentData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={appointmentData.notes}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>

            <Button onClick={createAppointment} className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Criar Agendamento
            </Button>
          </CardContent>
        </Card>

        {/* File Processing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Processar Arquivos
            </CardTitle>
            <CardDescription>
              Arraste arquivos aqui ou clique para selecionar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*,.ics"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    processFiles(files);
                  }
                }}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Clique para selecionar arquivos
                  </p>
                  <p className="text-xs text-gray-500">
                    Suporte para imagens e arquivos de calendário (.ics)
                  </p>
                </div>
              </label>
            </div>

            {processing && (
              <div className="mt-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Processando arquivos...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supported Formats */}
        <Card>
          <CardHeader>
            <CardTitle>Formatos Suportados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Imagens</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">JPG</Badge>
                  <Badge variant="outline">PNG</Badge>
                  <Badge variant="outline">GIF</Badge>
                  <Badge variant="outline">WebP</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Calendário</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">ICS</Badge>
                  <Badge variant="outline">iCal</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}