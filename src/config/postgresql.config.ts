import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

export const getPostgreSqlConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: 'localhost',
    port: configService.get('SQL_PORT') || 5432,
    username: 'student',
    password: configService.get('SQL_PASSWORD') || 'student',
    database: 'kupipodariday',
    schema: 'nest_project',
    entities: [User, Wish, Offer, Wishlist],
    synchronize: true,
  };
};
