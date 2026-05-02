// src/modules/notificacoes/repositories/inotificacoes.repository.ts
import { CreateNotificacaoDto } from "../dtos/create-notification.dto";
import { ResponseNotificacaoDto } from "../dtos/response-notification.dto";


export const INotificacoesRepositoryToken = 'INotificacoesRepository';


export interface INotificacoesRepository {
  /**
   * Cria uma nova notificação
   * @param data Dados para criação
   * @returns Notificação criada
   */
  create(data: CreateNotificacaoDto): Promise<ResponseNotificacaoDto>;

  /**
   * Lista todas as notificações de um usuário
   * @param userId ID do usuário
   * @returns Lista de notificações
   */
  findByUser(userId: number): Promise<ResponseNotificacaoDto[]>;

  /**
   * Atualiza uma notificação existente
   * @param id ID da notificação
   * @param data Dados para atualização
   * @returns Notificação atualizada
   */
  update?(id: number, data: Partial<CreateNotificacaoDto>): Promise<ResponseNotificacaoDto>;

  /**
   * Marca uma notificação como lida
   * @param id ID da notificação
   * @returns Notificação atualizada
   */
  markAsRead?(id: number): Promise<ResponseNotificacaoDto>;
}
