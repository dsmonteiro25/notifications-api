import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/global/prisma/prisma.service';
import { INotificacoesRepository } from './inotifications.repository';
import { CreateNotificacaoDto } from '../dtos/create-notification.dto';
import { ResponseNotificacaoDto } from '../dtos/response-notification.dto';

@Injectable()
export class NotificacoesRepository implements INotificacoesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNotificacaoDto): Promise<ResponseNotificacaoDto> {
    const notificacao = await this.prisma.notificacao.create({ data });
    return new ResponseNotificacaoDto(notificacao);
  }

  async findByUser(userId: number): Promise<ResponseNotificacaoDto[]> {
    const notificacoes = await this.prisma.notificacao.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return notificacoes.map((n) => new ResponseNotificacaoDto(n));
  }
}
