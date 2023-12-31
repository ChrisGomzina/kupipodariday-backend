import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common/exceptions';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateWishlistDto, user: User): Promise<Wishlist> {
    const wishesArr = await this.wishesService.findManyById(dto.itemsId);
    await this.wishlistsRepository.save({
      ...dto,
      owner: user,
      items: wishesArr,
    });
    return await this.wishlistsRepository.findOne({
      where: { name: dto.name },
      relations: ['owner', 'items'],
    });
  }

  async findOneById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    return wishlist;
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async updateOneById(
    id: number,
    dto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findOneById(id);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Нельзя удалять чужие вишлисты');
    }

    const wishes = await this.wishesService.findManyById(dto.itemsId || []);
    return await this.wishlistsRepository.save({
      ...wishlist,
      name: dto.name,
      image: dto.image,
      description: dto.description,
      items: wishes.concat(wishlist.items),
    });
  }

  async remove(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.findOneById(id);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    if (wishlist.owner.id !== userId) {
      throw new BadRequestException('Нельзя удалять чужие вишлисты');
    }

    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
