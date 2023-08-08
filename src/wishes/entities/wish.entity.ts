import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import {
  IsInt,
  IsDate,
  IsNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

@Entity()
export class Wish {
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
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column('decimal')
  @IsNumber()
  price: number;

  @Column('decimal', { default: 0 })
  @IsNumber()
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({ default: 0 })
  @IsInt()
  copied: number;
}
