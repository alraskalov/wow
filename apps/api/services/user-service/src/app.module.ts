import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
