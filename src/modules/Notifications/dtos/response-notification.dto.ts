import { ApiSchema } from "@nestjs/swagger";
import { Notificacao } from "generated/prisma";

@ApiSchema({
  name: "response-notificacao",
  description: "Objeto de resposta de notificação",
})
export class ResponseNotificacaoDto {
  id_notificacao: number;
  user_id: number;
  message: string;
  type: string;
  read_status: boolean;
  created_at: Date;

  constructor(notificacao: Notificacao) {
    this.id_notificacao = notificacao.id_notificacao;
    this.user_id = notificacao.user_id;
    this.message = notificacao.message;
    this.type = notificacao.type;
    this.read_status = notificacao.read_status;
    this.created_at = notificacao.created_at;
  }
}
