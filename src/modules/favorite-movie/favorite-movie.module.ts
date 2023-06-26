import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from '../../config/app.config';

import { FavoriteMovieSchema } from './favorite-movie.schema';

import { FavoriteMovieService } from './favorite-movie.service';

import { FavoriteMovieController } from './favorite-movie.controller';

import { UserModule } from '../user/user.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    MongooseModule.forFeature([
      { name: 'FavoriteMovie', schema: FavoriteMovieSchema },
    ]),
    UserModule,
    MovieModule,
  ],
  providers: [FavoriteMovieService],
  controllers: [FavoriteMovieController],
})
export class FavoriteMovieModule {}
