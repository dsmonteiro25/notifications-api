import { ApiSchema } from "@nestjs/swagger";
import { IsOptional, IsString, IsBoolean } from "class-validator";

@ApiSchema({
  name: "update-notificacao",
  description: "Objeto para atualizar uma notificação existente",
})
export class UpdateNotificacaoDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  read_status?: boolean; 
}
