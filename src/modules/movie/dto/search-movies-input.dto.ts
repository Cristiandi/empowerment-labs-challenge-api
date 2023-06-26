import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

enum Language {
  EN = 'en-US',
  ES = 'es-CO',
}

export class SearchMoviesInput {
  @ApiProperty({
    type: String,
    example: 'The Lord of the Rings',
  })
  @IsString()
  readonly query: string;

  @ApiProperty({
    type: String,
    example: 'en-US',
  })
  @IsEnum(Language, {
    message: `language must be one of ${Object.values(Language)
      .map((item) => `'${item}'`)
      .join(', ')}`,
  })
  readonly language: string;

  @ApiPropertyOptional({
    type: String,
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  readonly page?: string;
}
