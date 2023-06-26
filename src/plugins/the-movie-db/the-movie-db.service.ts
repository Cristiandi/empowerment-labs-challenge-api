import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { firstValueFrom, timeout } from 'rxjs';

import appConfig from '../../config/app.config';

import { GetPopularMoviesInput } from './dto/get-popular-movies-input.dto';
import { SearchMoviesInput } from './dto/search-movies-input.dto';
import { MoviesOutput } from './dto/movies-output.dto';

@Injectable()
export class TheMovieDbService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly httpService: HttpService,
  ) {}

  private formatMoviesOutput(data: any): MoviesOutput {
    const { page, results, total_pages, total_results } = data;

    return {
      page,
      results: results.map((result: any) => ({
        movieApiId: result.id,
        language: result.original_language,
        genres: result.genre_ids,
        originalLanguage: result.original_language,
        title: result.title,
        overview: result.overview,
        popularity: result.popularity,
        posterPath: result.poster_path,
        releaseDate: result.release_date,
        video: result.video,
        voteAverage: result.vote_average,
        voteCount: result.vote_count,
      })),
      totalPages: total_pages,
      totalResults: total_results,
    };
  }

  public async getPopularMovies(
    input: GetPopularMoviesInput,
  ): Promise<MoviesOutput> {
    const {
      theMovieDB: { url, apiKey },
    } = this.appConfiguration;

    const { page } = input;

    const observable = this.httpService
      .get(`${url}movie/popular`, {
        params: {
          api_key: apiKey,
          page,
        },
      })
      .pipe(timeout(10000));

    const { data } = await firstValueFrom(observable);

    return this.formatMoviesOutput(data);
  }

  public async searchMovies(input: SearchMoviesInput): Promise<MoviesOutput> {
    const {
      theMovieDB: { url, apiKey },
    } = this.appConfiguration;

    const { query, language, page } = input;

    const observable = this.httpService
      .get(`${url}search/movie`, {
        params: {
          api_key: apiKey,
          query,
          language,
          page,
        },
      })
      .pipe(timeout(10000));

    const { data } = await firstValueFrom(observable);

    return this.formatMoviesOutput(data);
  }
}
