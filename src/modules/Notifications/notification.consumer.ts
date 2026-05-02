import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { NotificacoesService } from './notifications.service';
import { CreateNotificacaoDto } from './dtos/create-notification.dto';
import { NotificacoesGateway } from './notifications.gateway'; 

interface NotificationMessage {
  user_id: number;
  message: string;
  type?: string;
  payload?: any;
}

@Injectable()
export class NotificacaoConsumer {
  private readonly logger = new Logger(NotificacaoConsumer.name);

  constructor(
    private readonly notificacoesService: NotificacoesService,
    private readonly gateway: NotificacoesGateway 
  ) {}

  @RabbitSubscribe({
    exchange: 'leiloes',
    routingKey: 'notificacao.criada',
    queue: 'fila_notificacoes',
  })
  async handleNotification(msg: NotificationMessage) {
    this.logger.log(
      `[RABBITMQ] Mensagem recebida da fila: ${JSON.stringify(msg)}`,
    );

    try {
      // 1. Persistir a notificação no banco (Histórico)
      const data: CreateNotificacaoDto = {
        user_id: msg.user_id,
        message: msg.message || 'Nova notificação',
        type: msg.type || 'system', 
      };

      await this.notificacoesService.create(data);
      
      // 2. Enviar em tempo real via WebSocket (Comparativo A)
      this.gateway.notifyAll('notification', {
        message: msg.message,
        type: msg.type,
        data: msg.payload,
        via: 'WebSocket'
      });

      // 3. [Novo] Enviar em tempo real via SSE (Comparativo B)
      this.notificacoesService.emitirEventoSSE({
        message: msg.message,
        type: msg.type,
        data: msg.payload,
        via: 'SSE'
      });

      this.logger.log(`[DISPATCH] Notificação enviada via WS e SSE para user_id=${msg.user_id}`);
    } catch (err) {
      this.logger.error('Erro ao processar notificação', err);
    }
  }
}