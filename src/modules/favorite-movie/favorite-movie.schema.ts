import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../user/user.schema';
import { Movie } from '../movie/movie.schema';

export type FavoriteMovieDocument = HydratedDocument<FavoriteMovie>;

@Schema({ collection: 'favorite_movie' })
export class FavoriteMovie {
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

  @Prop()
  createdAt: Date;
}

export const FavoriteMovieSchema = SchemaFactory.createForClass(FavoriteMovie);
