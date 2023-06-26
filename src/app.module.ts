import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import appConfig from './config/app.config';

import { AppService } from './app.service';

import { AppController } from './app.controller';

import { CommonModule } from './common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { MovieModule } from './modules/movie/movie.module';
import { MovieNoteModule } from './modules/movie-note/movie-note.module';
import { FavoriteMovieModule } from './modules/favorite-movie/favorite-movie.module';
import { TheMovieDbModule } from './plugins/the-movie-db/the-movie-db.module';

@Module({
  imports: [
    // config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    // Mongoose
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get<string>('config.mongoDB.uri'),
        };
      },
    }),

    CommonModule,

    UserModule,

    MovieModule,

    MovieNoteModule,

    FavoriteMovieModule,

    TheMovieDbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
