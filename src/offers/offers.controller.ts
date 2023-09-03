import {
  Controller,
  UseGuards,
  Get,
  Param,
  Body,
  Req,
  Post,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';

@UseGuards(ThrottlerGuard)
@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(@Body() dto: CreateOfferDto, @Req() { user }: { user: User }) {
    return await this.offersService.create(dto, user);
  }

  @Get()
  async getAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.offersService.findOneById(Number(id));
  }
}
