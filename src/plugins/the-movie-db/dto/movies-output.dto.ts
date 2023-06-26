import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../../modules/movie/movie.schema';

export class MoviesOutput {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  readonly page: number;

  @ApiProperty({
    type: [Movie],
  })
  readonly results: Movie[];

  @ApiProperty({
    type: Number,
    example: 500,
  })
  readonly totalPages: number;

  @ApiProperty({
    type: Number,
    example: 10000,
  })
  readonly totalResults: number;
}
