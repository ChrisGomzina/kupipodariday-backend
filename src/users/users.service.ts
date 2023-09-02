import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { HashService } from '../hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.usersRepository.save({
      ...dto,
      password: await this.hashService.hashPassword(dto.password),
    });
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({ username });
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async findMany(query: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async updateOneById(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.email && dto.email !== user.email) {
      const email = await this.findByEmail(dto.email);
      if (email) {
        throw new BadRequestException(
          'Пользователь с такой почтой или именем уже существует',
        );
      }
    }

    if (dto.username && dto.username !== user.username) {
      const username = await this.findByUsername(dto.username);
      if (username) {
        throw new BadRequestException(
          'Пользователь с такой почтой или именем уже существует',
        );
      }
    }

    if (dto.password) {
      dto.password = await this.hashService.hashPassword(dto.password);
    }
    const updatedUser: User = {
      ...user,
      username: dto?.username,
      email: dto?.email,
      password: dto?.password,
      about: dto?.about,
      avatar: dto?.avatar,
    };

    await this.usersRepository.update(user.id, updatedUser);
    return await this.findById(id);
  }

  async findUserWishes(username: string): Promise<Wish[]> {
    const { wishes } = await this.usersRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });

    if (!wishes) {
      throw new NotFoundException('Пользователь не найден');
    }

    return wishes;
  }
}
