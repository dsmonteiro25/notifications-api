import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { NotificacoesService } from "./notifications.service";

@WebSocketGateway({ cors: true })
export class NotificacoesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificacoesService: NotificacoesService) {}


  @SubscribeMessage("sendNotification")
  async handleSendNotification(@MessageBody() data: any) {
    this.server.emit("notification", data);
    await this.notificacoesService.create(data);
  }


  async notifyAll(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
