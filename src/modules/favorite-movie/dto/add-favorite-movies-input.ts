import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddFavoriteMoviesInput {
  @ApiProperty({
    example: '1234567890',
  })
  @IsString()
  readonly userAuthUid: string;

  @ApiProperty({
    example: [123, 456, 789],
  })
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  readonly movieApiIds: number[];
}
