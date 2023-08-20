import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Body,
  Param,
} from '@nestjs/common';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async createWish(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishDto,
  ): Promise<Record<string, never>> {
    return await this.wishesService.create(dto, user);
  }

  @Get()
  async findAllWishes(): Promise<Wish[]> {
    return await this.wishesService.findAll();
  }

  @Get(':id')
  async getWishById(@Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findById(Number(id));
  }

  @Patch(':id')
  async updateWish(
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
    @Req() { user }: { user: User },
  ) {
    return await this.wishesService.updateOneById(Number(id), dto, user.id);
  }

  @Delete(':id')
  async deleteWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Wish> {
    return await this.wishesService.remove(Number(id), user.id);
  }
}
