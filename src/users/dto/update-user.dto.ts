import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(2, 30)
  @IsOptional()
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @Length(2, 200)
  @IsOptional()
  about: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
