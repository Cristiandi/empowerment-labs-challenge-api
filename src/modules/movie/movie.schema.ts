import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ collection: 'movie' })
export class Movie {
  @ApiProperty({
    type: Number,
    example: 1234567890,
  })
  @Prop({ required: true, unique: true })
  movieApiId: number;

  @ApiProperty({
    type: String,
    example: 'en-US',
  })
  @Prop({ required: true })
  language: string;

  @ApiProperty({
    type: [Number],
    example: [12, 14, 16],
  })
  @Prop({ required: true })
  genres: number[];

  @ApiProperty({
    type: String,
    example: 'en',
  })
  @Prop({ required: true })
  originalLanguage: string;

  @ApiProperty({
    type: String,
    example: 'The Lord of the Rings: The Return of the King',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    type: String,
    example:
      "The final confrontation between the forces of good and evil fighting for control of the future of Middle-earth. Hobbits Frodo and Sam reach Mordor in their quest to destroy the `one ring', while Aragorn leads the forces of good against Sauron's evil army at the stone city of Minas Tirith.",
  })
  @Prop({ required: true })
  overview: string;

  @ApiProperty({
    type: Number,
    example: 201,
  })
  @Prop({ required: true })
  popularity: number;

  @ApiProperty({
    type: String,
    example: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
  })
  @Prop({ required: true })
  posterPath: string;

  @ApiProperty({
    type: String,
    example: '2003-12-01',
  })
  @Prop({ required: true })
  releaseDate: string;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Prop({ required: true })
  video: boolean;

  @ApiProperty({
    type: Number,
    example: 8.5,
  })
  @Prop({ required: true })
  voteAverage: number;

  @ApiProperty({
    type: Number,
    example: 10000,
  })
  @Prop({ required: true })
  voteCount: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
