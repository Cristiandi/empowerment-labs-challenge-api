import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from '../../config/app.config';

import { MovieSchema } from './movie.schema';

import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

import { TheMovieDbModule } from '../../plugins/the-movie-db/the-movie-db.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema }]),
    TheMovieDbModule,
  ],
  providers: [MovieService],
  controllers: [MovieController],
  exports: [MovieService],
})
export class MovieModule {}
