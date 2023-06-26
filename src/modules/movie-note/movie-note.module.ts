import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import appConfig from '../../config/app.config';

import { MovieNoteSchema } from './movie-note.schema';

import { MovieNoteService } from './movie-note.service';

import { MovieNoteController } from './movie-note.controller';

import { UserModule } from '../user/user.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    MongooseModule.forFeature([{ name: 'MovieNote', schema: MovieNoteSchema }]),
    UserModule,
    MovieModule,
  ],
  providers: [MovieNoteService],
  controllers: [MovieNoteController],
  exports: [MovieNoteService],
})
export class MovieNoteModule {}
