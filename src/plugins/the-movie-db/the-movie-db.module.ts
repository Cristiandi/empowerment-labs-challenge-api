import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import appConfig from '../../config/app.config';

import { TheMovieDbService } from './the-movie-db.service';

@Module({
  imports: [ConfigModule.forFeature(appConfig), HttpModule],
  providers: [TheMovieDbService],
  exports: [TheMovieDbService],
})
export class TheMovieDbModule {}
