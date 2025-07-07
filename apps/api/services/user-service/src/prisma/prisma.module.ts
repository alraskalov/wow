import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Экспортируем, чтобы другие модули могли его использовать
})
export class PrismaModule {}
