import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificacoesModule } from './modules/Notifications/notifications.module';
import { PrismaModule } from './modules/global/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    NotificacoesModule,
  ],
})
export class AppModule {}
