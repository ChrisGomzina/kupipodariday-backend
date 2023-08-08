import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from './entities/wishlist.entity';

@Module({
  providers: [WishlistsService],
  controllers: [WishlistsController]
})
export class WishlistsModule {}
