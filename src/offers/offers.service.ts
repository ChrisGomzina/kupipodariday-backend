import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { calculateRaised } from './helpers/calculate';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    dto: CreateOfferDto,
    user: User,
  ): Promise<Record<string, never>> {
    const wish = await this.wishesService.findById(dto.itemId);

    if (!wish) {
      throw new NotFoundException('Подарок с таким id не найден');
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException(
        'Вы не можете вносить средства для своего подарка',
      );
    }

    const calculatedRaised = calculateRaised(Number(wish.raised), dto.amount);
    if (calculatedRaised > wish.price) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    await this.wishesService.updateWishRaised(wish.id, calculatedRaised);
    const createdOffer = this.offersRepository.create({
      ...dto,
      user,
      item: wish,
    });
    this.offersRepository.save(createdOffer);
    return {};
  }

  async findOneById(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });

    if (!offer) {
      throw new NotFoundException('Предложение не найдено');
    }

    delete offer.user.password;
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return await this.offersRepository.find({
      relations: ['item', 'user'],
    });
  }
}
