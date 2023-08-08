import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { IsInt, IsDate, Length, IsUrl } from 'class-validator';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  @Length(0, 250)
  name: string;

  @Column()
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;
}
