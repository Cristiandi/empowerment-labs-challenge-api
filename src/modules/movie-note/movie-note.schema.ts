import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../user/user.schema';
import { Movie } from '../movie/movie.schema';

export type MovieNoteDocument = HydratedDocument<MovieNote>;

@Schema({ collection: 'movie_note' })
export class MovieNote {
  @ApiProperty({
    type: String,
    example: 'Note title',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    type: String,
    example: 'Note description',
  })
  @Prop({ required: true })
  description: string;

  @ApiPropertyOptional({
    type: String,
    example: 'https://image.tmdb.org/t/p/w500/6esNUoXh4xQvucB7o7e3TCfjI65.jpg',
  })
  @Prop()
  imageUrl: string;

  @ApiProperty({
    type: User,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @ApiProperty({
    type: Movie,
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true })
  movie: Movie;

  @ApiProperty({
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
  })
  @Prop()
  createdAt: Date;
}

export const MovieNoteSchema = SchemaFactory.createForClass(MovieNote);
