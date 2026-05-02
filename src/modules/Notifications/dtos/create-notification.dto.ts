import { ApiSchema } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";

@ApiSchema({
  name: "create-notificacao",
  description: "Objeto para criar uma notificação",
})
export class CreateNotificacaoDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  type: string; 

  @IsOptional()
  @IsBoolean()
  read_status?: boolean;
}
