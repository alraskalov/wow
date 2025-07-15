import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get('all')
  public get() {
    return this.userService.get()
  }

  @Get(':id')
  public find(@Param('id') id: string) {
    return this.userService.find(id)
  }

  @Delete(':id')
  public delete(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
