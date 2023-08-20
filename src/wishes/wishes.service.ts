import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateWishDto, user: User): Promise<Record<string, never>> {
    await this.wishRepository.save({
      ...dto,
      owner: user,
    });
    return {};
  }

  async findById(id: number, relations?): Promise<Wish> {
    const queryOptions = {};
    if (relations) {
      queryOptions['relations'] = relations;
    }
    const wish = await this.wishRepository.findOne({
      where: { id },
      ...queryOptions,
    });
    if (!wish) {
      throw new BadRequestException('Подарок с таким id не найден');
    }
    return wish;
  }

  async findAll(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: ['owner', 'offers'],
    });
    return wishes;
  }

  async findManyByIdArr(idArr: number[]): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { id: In(idArr) },
    });
  }

  async updateOneById(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    const wish = await this.wishRepository.findOne({
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
      return this.wishRepository.save(wish);
    }
    return wish;
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      relations: {
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
    try {
      return await this.wishRepository.remove(wish);
    } catch (err) {
      throw new ConflictException(
        'Нельзя удалить подарок на который уже скинулись',
      );
    }
  }

  async updateWishRaised(
    wishId: number,
    raised: number,
  ): Promise<Record<string, never>> {
    await this.wishRepository.update(wishId, { raised });
    return {};
  }
}
