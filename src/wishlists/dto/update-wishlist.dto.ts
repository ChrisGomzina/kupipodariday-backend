import { IsArray, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  image: string;

  @IsArray()
  @IsOptional()
  itemsId: number[];

  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description: string;
}
