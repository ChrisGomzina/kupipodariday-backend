import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { OwnerInterceptor } from '../common/owner.interceptor';
import { WishInterceptor } from '../common/wish.interceptor';
import { User } from '../users/entities/user.entity';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { Wish } from '../wishes/entities/wish.entity';

@UseGuards(ThrottlerGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishDto,
  ) {
    return await this.wishesService.create(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(@Req() { user }: { user: User }, @Param('id') id: string) {
    return await this.wishesService.createCopy(Number(id), user);
  }

  @Get('last')
  async findLast() {
    return await this.wishesService.sortWishes('createdAt', 'DESC', 40);
  }

  @Get('top')
  async findTop() {
    return await this.wishesService.sortWishes('copied', 'ASC', 20);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UseInterceptors(OwnerInterceptor<Wish[]>)
  @UseInterceptors(WishInterceptor)
  async findById(@Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateWish(
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
    @Req() { user }: { user: User },
  ) {
    return await this.wishesService.updateOneById(Number(id), dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @UseInterceptors(OwnerInterceptor<Wish>)
  async deleteWish(@Req() { user }: { user: User }, @Param('id') id: string) {
    return await this.wishesService.remove(Number(id), user.id);
  }
}
