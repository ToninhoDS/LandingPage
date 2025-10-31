import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { whatsappService } from '@/services/whatsapp';
import { formatDateTime } from '@/lib/utils';

export function useWhatsAppNotifications(barbeariaId: string) {
  useEffect(() => {
    if (!barbeariaId) return;

    // Escutar novos agendamentos
    const agendamentosSubscription = supabase
      .channel('agendamentos_whatsapp')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agendamentos',
          filter: `barbearia_id=eq.${barbeariaId}`,
        },
        async (payload) => {
          await handleNewAppointment(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agendamentos',
          filter: `barbearia_id=eq.${barbeariaId}`,
        },
        async (payload) => {
          await handleAppointmentUpdate(payload.new, payload.old);
        }
      )
      .subscribe();

    return () => {
      agendamentosSubscription.unsubscribe();
    };
  }, [barbeariaId]);

  const handleNewAppointment = async (agendamento: any) => {
    try {
      // Buscar dados completos do agendamento
      const { data: agendamentoCompleto } = await supabase
        .from('agendamentos')
        .select(`
          *,
          usuario:usuarios(nome, whatsapp),
          barbeiro:barbeiros(usuario:usuarios(nome)),
          agendamento_servicos(servico:servicos(nome, preco))
        `)
        .eq('id', agendamento.id)
        .single();

      if (!agendamentoCompleto?.usuario?.whatsapp) {
        console.log('Cliente não possui WhatsApp cadastrado');
        return;
      }

      const servicos = agendamentoCompleto.agendamento_servicos
        .map((as: any) => as.servico.nome)
        .join(', ');

      const dataHora = formatDateTime(agendamento.data_hora);

      // Enviar confirmação de agendamento
      await whatsappService.sendAppointmentConfirmation(
        agendamentoCompleto.usuario.whatsapp,
        agendamentoCompleto.usuario.nome,
        agendamentoCompleto.barbeiro.usuario.nome,
        dataHora,
        servicos,
        barbeariaId
      );

      // Agendar lembrete para 1 dia antes
      await scheduleReminder(agendamentoCompleto);

    } catch (error) {
      console.error('Erro ao processar novo agendamento:', error);
    }
  };

  const handleAppointmentUpdate = async (newData: any, oldData: any) => {
    try {
      // Se o status mudou para cancelado
      if (oldData.status !== 'cancelado' && newData.status === 'cancelado') {
        await handleAppointmentCancellation(newData);
      }

      // Se a data/hora foi alterada
      if (oldData.data_hora !== newData.data_hora) {
        await handleAppointmentReschedule(newData);
      }
    } catch (error) {
      console.error('Erro ao processar atualização de agendamento:', error);
    }
  };

  const handleAppointmentCancellation = async (agendamento: any) => {
    try {
      const { data: agendamentoCompleto } = await supabase
        .from('agendamentos')
        .select(`
          *,
          usuario:usuarios(nome, whatsapp),
          barbeiro:barbeiros(usuario:usuarios(nome))
        `)
        .eq('id', agendamento.id)
        .single();

      if (!agendamentoCompleto?.usuario?.whatsapp) return;

      const dataHora = formatDateTime(agendamento.data_hora);

      await whatsappService.sendTextMessage(
        agendamentoCompleto.usuario.whatsapp,
        `Olá ${agendamentoCompleto.usuario.nome}! Seu agendamento com ${agendamentoCompleto.barbeiro.usuario.nome} para ${dataHora} foi cancelado. Entre em contato conosco para reagendar.`,
        barbeariaId
      );
    } catch (error) {
      console.error('Erro ao enviar notificação de cancelamento:', error);
    }
  };

  const handleAppointmentReschedule = async (agendamento: any) => {
    try {
      const { data: agendamentoCompleto } = await supabase
        .from('agendamentos')
        .select(`
          *,
          usuario:usuarios(nome, whatsapp),
          barbeiro:barbeiros(usuario:usuarios(nome))
        `)
        .eq('id', agendamento.id)
        .single();

      if (!agendamentoCompleto?.usuario?.whatsapp) return;

      const novaDataHora = formatDateTime(agendamento.data_hora);

      await whatsappService.sendTextMessage(
        agendamentoCompleto.usuario.whatsapp,
        `Olá ${agendamentoCompleto.usuario.nome}! Seu agendamento com ${agendamentoCompleto.barbeiro.usuario.nome} foi reagendado para ${novaDataHora}.`,
        barbeariaId
      );

      // Reagendar lembrete
      await scheduleReminder(agendamentoCompleto);
    } catch (error) {
      console.error('Erro ao enviar notificação de reagendamento:', error);
    }
  };

  const scheduleReminder = async (agendamento: any) => {
    try {
      const dataAgendamento = new Date(agendamento.data_hora);
      const umDiaAntes = new Date(dataAgendamento.getTime() - 24 * 60 * 60 * 1000);
      const agora = new Date();

      // Só agendar se ainda não passou do horário do lembrete
      if (umDiaAntes > agora) {
        // Aqui você pode implementar um sistema de agendamento de tarefas
        // Por exemplo, usando um serviço como Supabase Edge Functions com cron
        // ou integrando com um sistema de filas como Redis/Bull

        console.log(`Lembrete agendado para ${umDiaAntes.toISOString()}`);
        
        // Por enquanto, vamos salvar na tabela de notificações para processamento posterior
        await supabase.from('notificacoes').insert({
          usuario_id: agendamento.usuario_id,
          titulo: 'Lembrete de Agendamento',
          mensagem: `Você tem um agendamento amanhã às ${formatDateTime(agendamento.data_hora)}`,
          tipo: 'lembrete',
          lida: false,
        });
      }
    } catch (error) {
      console.error('Erro ao agendar lembrete:', error);
    }
  };

  const sendPromotionalCampaign = async (
    clientesWhatsApp: string[],
    promocao: string
  ) => {
    try {
      const promises = clientesWhatsApp.map(async (whatsapp) => {
        // Buscar nome do cliente
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('nome')
          .eq('whatsapp', whatsapp)
          .single();

        if (usuario) {
          return whatsappService.sendPromotionalMessage(
            whatsapp,
            usuario.nome,
            promocao,
            barbeariaId
          );
        }
      });

      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Erro ao enviar campanha promocional:', error);
      return false;
    }
  };

  return {
    sendPromotionalCampaign,
  };
}