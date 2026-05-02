import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'; 

@Injectable()
export class RabbitService {
    private readonly logger = new Logger(RabbitService.name);
    private readonly exchange = 'leiloes';
    private readonly routingKey = 'lance.recebido'; 
    

    constructor(private readonly amqpConnection: AmqpConnection) {}


    async publishMessage(message: any) {
        const start = Date.now(); 
        try {

            await this.amqpConnection.publish(
                this.exchange,
                this.routingKey,
                message 
            );
            
            const duration = Date.now() - start; 
            
            this.logger.log(`📤 [METRICA PUB] Mensagem publicada em ${this.routingKey}. Latência: ${duration}ms`);
            
        } catch (error) {
            this.logger.error(`Falha ao publicar mensagem em ${this.routingKey}:`, error);

            throw new Error('Falha na publicação RabbitMQ.');
        }
    }
}
