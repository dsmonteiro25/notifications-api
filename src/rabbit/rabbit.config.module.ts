import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('RABBITMQ_URI') || 'amqp://guest:guest@rabbitmq:5672',
        exchanges: [
          {
            name: 'leiloes',
            type: 'topic',
          },
        ],
        connectionInitOptions: { wait: false },
      }),
      inject: [ConfigService],
    }),
  ],
  
  exports: [RabbitMQModule], 
})
export class RabbitConfigModule {}