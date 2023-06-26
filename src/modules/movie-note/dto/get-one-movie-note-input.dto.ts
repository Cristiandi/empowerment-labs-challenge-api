import { IsString } from 'class-validator';

export class GetOneMovieNoteInput {
  @IsString()
  readonly id: string;
}
