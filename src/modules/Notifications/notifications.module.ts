import { Module } from '@nestjs/common';
import { NotificacoesService } from './notifications.service';
import { NotificacoesController } from './notifications.controller';
import { PrismaService } from '../global/prisma/prisma.service';
import { NotificacoesRepository } from './repositories/notifications.repository';
import { INotificacoesRepositoryToken } from './repositories/inotifications.repository';
import { RabbitConfigModule } from 'src/rabbit/rabbit.config.module';
import { NotificacaoConsumer } from './notification.consumer';
import { NotificacoesGateway } from './notifications.gateway'; // [Alterado] Importação adicionada

@Module({
  imports: [RabbitConfigModule],
  controllers: [NotificacoesController],
  providers: [
    NotificacoesService,
    PrismaService,
    NotificacaoConsumer,
    NotificacoesGateway, // [Alterado] Gateway adicionado aos providers
    {
      provide: INotificacoesRepositoryToken,
      useClass: NotificacoesRepository,
    },
  ],
  exports: [NotificacoesService],
})
export class NotificacoesModule {}