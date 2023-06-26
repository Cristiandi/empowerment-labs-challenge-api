import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateMovieNoteInput {
  @ApiProperty({
    example: '1234567890',
  })
  @IsString()
  readonly userAuthUid: string;

  @ApiProperty({
    example: 123,
  })
  @IsNumber()
  readonly movieApiId: number;

  @ApiProperty({
    example: 'This is a note',
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: 'Note description',
  })
  @IsString()
  readonly description: string;

  @ApiPropertyOptional({
    example: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
  })
  @IsOptional()
  @IsUrl()
  readonly imageUrl?: string;
}
