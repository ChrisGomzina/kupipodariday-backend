import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(dto: CreateWishDto, user: User): Promise<Record<string, never>> {
    await this.wishesRepository.save({
      ...dto,
      owner: user,
    });
    return {};
  }

  async createCopy(wishId: number, user: User): Promise<Record<string, never>> {
    const copiedWish = await this.wishesRepository.findOneBy({ id: wishId });

    if (!copiedWish) {
      throw new NotFoundException('Подарок с таким id не найден');
    }

    delete copiedWish.id;
    delete copiedWish.createdAt;
    delete copiedWish.updatedAt;

    await this.wishesRepository.update(wishId, {
      copied: (copiedWish.copied += 1),
    });

    const wishCopy = {
      ...copiedWish,
      owner: user,
      copied: 0,
      raised: 0,
      offers: [],
    };

    await this.create(wishCopy, user);

    return {};
  }

  async sortWishes(
    key: 'copied' | 'createdAt',
    sortOrder: 'ASC' | 'DESC',
    quantity: number,
  ): Promise<Wish[]> {
    const order = { [key]: sortOrder };

    return await this.wishesRepository.find({
      take: quantity,
      order: order,
      relations: [
        'owner',
        'offers',
        'offers.user',
        'offers.user.wishes',
        'offers.user.offers',
        'offers.user.wishlists',
      ],
    });
  }

  async findById(id: number, relations?): Promise<Wish> {
    const queryOptions = {};

    if (relations) {
      queryOptions['relations'] = relations;
    }
    const wish = await this.wishesRepository.findOne({
      where: { id },
      ...queryOptions,
    });

    if (!wish) {
      throw new BadRequestException('Подарок с таким id не найден');
    }

    return wish;
  }

  async findManyById(idArr: number[]): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: { id: In(idArr) },
    });
  }

  async updateOneById(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    const wish = await this.wishesRepository.findOne({
      relations: {
        offers: true,
        owner: true,
      },
      where: {
        id,
        owner: {
          id: userId,
        },
      },
    });

    if (!wish) throw new BadRequestException('Подарок с таким id не найден');

    if (!wish.offers.length) {
      for (const key in updateWishDto) {
        wish[key] = updateWishDto[key];
      }
      return this.wishesRepository.save(wish);
    }

    return wish;
  }

  async remove(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findById(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок с таким id не найден');
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException('Удалить чужой подарок нельзя');
    }

    await this.wishesRepository.delete(wishId);

    return wish;
  }

  async updateWishRaised(
    wishId: number,
    raised: number,
  ): Promise<Record<string, never>> {
    await this.wishesRepository.update(wishId, { raised });
    return {};
  }
}
