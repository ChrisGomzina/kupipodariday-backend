import { Controller, Get, Body, Patch, Req, Param, Post } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  async getAuthUser(@Req() { user }: { user: User }): Promise<User> {
    const userProfileData = await this.usersService.findById(user.id);
    if (!userProfileData) {
      throw new NotFoundException();
    }
    return userProfileData;
  }

  @Patch('me')
  async updateAuthUser(
    @Req() { user }: { user: User },
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateOneById(user.id, dto);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('Пользователя не существует');
    }
    return user;
  }

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User[]> {
    return await this.usersService.findMany(query);
  }
}
