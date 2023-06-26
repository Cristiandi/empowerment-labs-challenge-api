import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import appConfig from '../../config/app.config';

import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';

import { FavoriteMovieDocument } from './favorite-movie.schema';
import { AddFavoriteMoviesInput } from './dto/add-favorite-movies-input';

@Injectable()
export class FavoriteMovieService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectModel('FavoriteMovie')
    private readonly favoriteMovieModel: Model<FavoriteMovieDocument>,
    private readonly userService: UserService,
    private readonly movieService: MovieService,
  ) {}

  public async addFavoriteMovies(input: AddFavoriteMoviesInput) {
    const { userAuthUid, movieApiIds } = input;

    // get user
    const existingUser = await this.userService.getUserByAuthUid(userAuthUid);

    // check if user exists
    if (!existingUser) {
      throw new NotFoundException('user not found');
    }

    // remove dupplicated movie api ids
    const noDupplicatedMovieApiIds = [...new Set(movieApiIds)];

    // get movies
    const existingMovies = await this.movieService.getMoviesByApiIds(
      noDupplicatedMovieApiIds,
    );

    // check if all movies exist
    if (existingMovies.length !== noDupplicatedMovieApiIds.length) {
      throw new NotFoundException('one or more movies not found');
    }

    // for each movie check if it is already favorited
    await Promise.all(
      existingMovies.map(async (movie) => {
        const existingFavoriteMovie = await this.favoriteMovieModel.findOne({
          user: existingUser,
          movie,
        });

        // if it is already favorited, throw an error
        if (existingFavoriteMovie) {
          throw new ConflictException(
            `movie ${movie.movieApiId} already favorited`,
          );
        }
      }),
    );

    // create favorite movies
    const favoriteMovies = await this.favoriteMovieModel.create(
      existingMovies.map((movie) => ({
        user: existingUser,
        movie,
        createdAt: new Date(),
      })),
    );

    // save favorite movies
    await this.favoriteMovieModel.bulkSave(favoriteMovies);

    return favoriteMovies;
  }
}
