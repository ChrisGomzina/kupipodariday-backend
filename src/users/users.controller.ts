import {
  Controller,
  UseGuards,
  Get,
  Body,
  Patch,
  Req,
  Param,
  Post,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ThrottlerGuard } from '@nestjs/throttler';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(ThrottlerGuard)
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User[]> {
    return await this.usersService.findMany(query);
  }

  @Get('me')
  async getMe(@Req() { user }: { user: User }): Promise<User> {
    const userData = await this.usersService.findById(user.id);

    if (!userData) {
      throw new NotFoundException();
    }

    return userData;
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Пользователя не существует');
    }

    return user;
  }

  @Patch('me')
  async updateUser(
    @Req() { user }: { user: User },
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateOneById(user.id, dto);
  }

  @Get('me/wishes')
  async getMyWishes(@Req() { user }: { user: User }): Promise<Wish[]> {
    return await this.usersService.findUserWishes(user.username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Пользователя не существует');
    }

    return await this.usersService.findUserWishes(username);
  }
}
