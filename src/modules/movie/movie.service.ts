import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import appConfig from '../../config/app.config';

import { MovieDocument, Movie } from './movie.schema';

import { TheMovieDbService } from '../../plugins/the-movie-db/the-movie-db.service';

import { GetPopularMoviesInput } from './dto/get-popular-movies-input.dto';
import { SearchMoviesInput } from './dto/search-movies-input.dto';

@Injectable()
export class MovieService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectModel('Movie')
    private readonly movieModel: Model<MovieDocument>,
    private readonly theMovieDbService: TheMovieDbService,
  ) {}

  public async ingestMovies(movies: Movie[]) {
    // we could implement this logic using a message broker
    // to avoid blocking the event loop

    try {
      await Promise.all(
        movies.map((movie) => {
          return this.movieModel.findOneAndUpdate(
            { movieApiId: movie.movieApiId },
            movie,
            { upsert: true },
          );
        }),
      );

      Logger.log(`ingested ${movies.length} movies`, MovieService.name);
    } catch (error) {
      Logger.log(`error ingesting movies`, MovieService.name);
      Logger.error(error, MovieService.name);
    }
  }

  public async getPopularMovies(input: GetPopularMoviesInput) {
    const { page } = input;

    // get popular movies from the movie db
    const response = await this.theMovieDbService.getPopularMovies({
      page: +page || 1,
    });

    // ingest movies
    this.ingestMovies(response.results);

    return response;
  }

  public async searchMovies(input: SearchMoviesInput) {
    const { query, language, page } = input;

    const response = await this.theMovieDbService.searchMovies({
      query,
      language,
      page: +page || 1,
    });

    // ingest movies
    this.ingestMovies(response.results);

    return response;
  }

  public async getMoviesByApiIds(movieApiIds: number[]): Promise<Movie[]> {
    const movies = await this.movieModel.find({
      movieApiId: { $in: movieApiIds },
    });

    return movies;
  }

  public async getMovieByApiId(movieApiId: number): Promise<Movie> {
    const movie = await this.movieModel.findOne({ movieApiId });

    return movie;
  }
}
