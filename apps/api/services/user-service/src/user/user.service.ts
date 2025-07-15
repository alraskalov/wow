import {
  Injectable,
  ConflictException,
  Logger,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UserRepository } from './user.repository'
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  public async create(createUserDto: CreateUserDto) {
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

      // Возвращаем пользователя без пароля
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
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
        `Произошла непредвиденная ошибка при создании пользователя: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        error instanceof Error ? error.stack : undefined,
      )
      throw new InternalServerErrorException('Произошла непредвиденная ошибка')
    }
  }

  public async get() {
    this.logger.log('Запрос на получение всех пользователей')
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    })
  }

  public async find(id: string) {
    try {
      const user = await this.userRepository.find(id)
      if (!user) {
        throw new NotFoundException('Пользователь не найден!')
      }
      return user
    } catch (error) {
      this.logger.warn(error)
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Что-то пошло не так')
    }
  }

  public async delete(id: string) {
    try {
      const user = await this.userRepository.delete(id)
      if (!user) {
        throw new NotFoundException('Пользователь не найден!')
      }

      return {
        message: `Пользователь ${user.username} успешно удален!`,
      }
    } catch (error) {
      this.logger.warn(error)
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Что-то пошло не так')
    }
  }
}
