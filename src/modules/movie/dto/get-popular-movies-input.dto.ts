import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class GetPopularMoviesInput {
  @ApiPropertyOptional({
    type: String,
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  readonly page?: string;
}
