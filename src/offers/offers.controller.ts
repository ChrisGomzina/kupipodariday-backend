import { Controller, Get, Param, Body, Req, Post } from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async getAllOffers(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  async findOffersById(@Param('id') id: string): Promise<Offer> {
    return await this.offersService.findOneById(Number(id));
  }

  @Post()
  async createOffer(
    @Body() dto: CreateOfferDto,
    @Req() { user }: { user: User },
  ): Promise<Record<string, never>> {
    return await this.offersService.create(dto, user);
  }
}
