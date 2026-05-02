import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  Sse,           // [Novo]
  MessageEvent,  // [Novo]
} from '@nestjs/common';
import { NotificacoesService } from './notifications.service';
import { CreateNotificacaoDto } from './dtos/create-notification.dto';
import { UpdateNotificacaoDto } from './dtos/update-notification.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Observable } from 'rxjs'; // [Novo]

@ApiTags('Notificações')
@Controller('notificacoes')
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  // [Novo] Endpoint para Server-Sent Events (Cenários E3 e E4 do TCC)
  // URL de acesso: http://localhost:3001/notificacoes/stream
  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return this.notificacoesService.sseStream$;
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova notificação' })
  create(@Body() data: CreateNotificacaoDto) {
    return this.notificacoesService.create(data);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Lista todas as notificações de um usuário' })
  @ApiParam({ name: 'userId', type: Number, description: 'ID do usuário' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificacoesService.findByUser(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marca uma notificação como lida' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da notificação' })
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notificacoesService.markAsRead(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma notificação existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID da notificação' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateNotificacaoDto,
  ) {
    return this.notificacoesService.update(id, data);
  }
}