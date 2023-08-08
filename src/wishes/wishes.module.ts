import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Wish } from './entities/wish.entity';

@Module({
  providers: [WishesService],
  controllers: [WishesController]
})
export class WishesModule {}
