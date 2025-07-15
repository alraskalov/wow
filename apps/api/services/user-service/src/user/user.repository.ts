import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async find(id: string) {
    return this.prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        id,
      },
    })
  }

  public async delete(id: string) {
    return await this.prisma.user.delete({
      select: { username: true },
      where: { id },
    })
  }
}
