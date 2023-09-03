import {
  Controller,
  UseGuards,
  UseInterceptors,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { OwnerInterceptor } from '../common/owner.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(ThrottlerGuard)
@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseInterceptors(OwnerInterceptor)
  async createWishlist(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishlistDto,
  ) {
    return await this.wishlistsService.create(dto, user);
  }

  @Get()
  @UseInterceptors(OwnerInterceptor)
  async getWishlists() {
    return await this.wishlistsService.findAll();
  }

  @Get(':id')
  @UseInterceptors(OwnerInterceptor)
  async getWishlistById(@Param('id') wishId: string) {
    const wishlist = await this.wishlistsService.findOneById(Number(wishId));
    return wishlist;
  }

  @Patch(':id')
  @UseInterceptors(OwnerInterceptor)
  async updateWishlist(
    @Req() { user }: { user: User },
    @Param('id') wishId: string,
    @Body() dto: UpdateWishlistDto,
  ) {
    return await this.wishlistsService.updateOneById(
      Number(wishId),
      dto,
      user.id,
    );
  }

  @Delete(':id')
  @UseInterceptors(OwnerInterceptor)
  async deleteWishlist(
    @Req() { user }: { user: User },
    @Param('id') id: number,
  ) {
    return await this.wishlistsService.remove(id, user.id);
  }
}
