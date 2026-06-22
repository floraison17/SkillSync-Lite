import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}