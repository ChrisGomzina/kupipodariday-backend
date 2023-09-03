import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Body,
  Patch,
  Req,
  Param,
  Post,
} from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PrivetUserInterceptor } from '../common/privetUser.interceptor';
import { PublicUserInterceptor } from '../common/publicUser.interceptor';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(ThrottlerGuard)
@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(PrivetUserInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find')
  async findUsers(@Body('query') query: string) {
    return await this.usersService.findMany(query);
  }

  @Get('me')
  async getMe(@Req() { user }: { user: User }) {
    const userData = await this.usersService.findById(user.id);

    if (!userData) {
      throw new NotFoundException();
    }

    return userData;
  }

  @Get(':username')
  @UseInterceptors(PublicUserInterceptor)
  async getUserByUsername(@Param('username') username: string) {
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
  ) {
    return await this.usersService.updateOneById(user.id, dto);
  }

  @Get('me/wishes')
  async getMyWishes(@Req() { user }: { user: User }) {
    return await this.usersService.findUserWishes(user.username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Пользователя не существует');
    }

    return await this.usersService.findUserWishes(username);
  }
}
