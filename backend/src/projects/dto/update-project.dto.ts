import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;
}