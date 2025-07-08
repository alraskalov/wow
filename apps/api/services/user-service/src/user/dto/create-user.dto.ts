import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'

export class CreateUserDto {
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Имя пользователя может содержать только буквы, цифры и символ подчеркивания',
  })
  username!: string

  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  email!: string

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password!: string
}
