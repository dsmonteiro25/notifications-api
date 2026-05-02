import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/global/prisma/prisma.service';
import { CreateNotificacaoDto } from './dtos/create-notification.dto';
import { UpdateNotificacaoDto } from './dtos/update-notification.dto';
import { ResponseNotificacaoDto } from './dtos/response-notification.dto';
import { INotificacoesRepository, INotificacoesRepositoryToken } from './repositories/inotifications.repository';
import { Subject } from 'rxjs'; // [Novo] Importação para o SSE

@Injectable()
export class NotificacoesService {
  // [Novo] Canal de eventos para o SSE
  private sseSubject = new Subject<any>();

  constructor(
    @Inject(INotificacoesRepositoryToken)
    private readonly notificacoesRepository: INotificacoesRepository,
    // [Removido] private readonly amqpConnection: AmqpConnection, <-- Causa do Loop removida
    private readonly prisma: PrismaService, 
  ) {}

  // [Novo] Getter para o Controller acessar o fluxo de dados (Stream)
  get sseStream$() {
    return this.sseSubject.asObservable();
  }

  // [Novo] Método para empurrar dados para quem estiver conectado via SSE
  emitirEventoSSE(data: any) {
    this.sseSubject.next({ data });
  }

  async create(data: CreateNotificacaoDto): Promise<ResponseNotificacaoDto> {
    // [Corrigido] Apenas salva no banco de dados. 
    // Quem publica na fila é o LanceService, não este serviço.
    const notificacao = await this.notificacoesRepository.create(data);
    return notificacao;
  }

  async findAll(): Promise<ResponseNotificacaoDto[]> {
    const notificacoes = await this.prisma.notificacao.findMany({
      orderBy: { created_at: 'desc' },
    });

    return notificacoes.map((n) => new ResponseNotificacaoDto(n));
  }

  async findByUser(userId: number): Promise<ResponseNotificacaoDto[]> {
    return this.notificacoesRepository.findByUser(userId);
  }

  async markAsRead(id: number): Promise<ResponseNotificacaoDto> {
    const notificacao = await this.prisma.notificacao.update({
      where: { id_notificacao: id },
      data: { read_status: true },
    });

    return new ResponseNotificacaoDto(notificacao);
  }

  async update(
    id: number,
    data: UpdateNotificacaoDto,
  ): Promise<ResponseNotificacaoDto> {
    const notificacao = await this.prisma.notificacao.update({
      where: { id_notificacao: id },
      data,
    });

    return new ResponseNotificacaoDto(notificacao);
  }
}