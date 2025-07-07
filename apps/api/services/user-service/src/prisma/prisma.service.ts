import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Этот метод вызывается, когда NestJS успешно инициализировал модуль.
    // Мы подключаемся к базе данных здесь.
    await this.$connect()
  }
}
