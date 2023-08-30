import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() { user }): Promise<{ access_token: string }> {
    return this.authService.logIn(user);
  }

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    const { email } = dto;
    const foundUser = await this.usersService.findByEmail(email);

    if (foundUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const user = await this.usersService.create(dto);

    return this.authService.logIn(user);
  }
}
