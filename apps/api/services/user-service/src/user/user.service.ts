import {
  Injectable,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { Prisma, User, Role } from '@prisma/client'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log(
      `Попытка создания пользователя с email: ${createUserDto.email}`,
    )

    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      })

      this.logger.log(
        `Пользователь с email: ${createUserDto.email} успешно создан`,
      )
      const { password, ...result } = user
      return result
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.warn(
            `Ошибка создания пользователя: email ${createUserDto.email} или имя пользователя ${createUserDto.username} уже существует.`,
          )
          throw new ConflictException(
            'Пользователь с таким email или именем пользователя уже существует',
          )
        }
      }
      this.logger.error(
        `Произошла непредвиденная ошибка при создании пользователя: ${error.message}`,
        error.stack,
      )
      throw new InternalServerErrorException('Произошла непредвиденная ошибка')
    }
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    })
  }
}
