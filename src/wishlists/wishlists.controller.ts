import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async createWishlist(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.create(dto, user);
  }

  @Patch(':id')
  async updateWishlist(
    @Req() { user }: { user: User },
    @Param('id') wishId: string,
    @Body() dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateOneById(
      Number(wishId),
      dto,
      user.id,
    );
  }

  @Get()
  async getWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsService.findAll();
  }

  @Get(':id')
  async getWishlistById(@Param('id') wishId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistsService.findOneById(Number(wishId));

    return wishlist;
  }

  @Delete(':id')
  async deleteWishlist(
    @Req() { user }: { user: User },
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.remove(id, user.id);
  }
}
