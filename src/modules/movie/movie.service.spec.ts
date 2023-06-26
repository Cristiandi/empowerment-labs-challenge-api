import * as path from 'path';

import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import appConfig from '../../config/app.config';

import { Movie } from './movie.schema';

import { MovieService } from './movie.service';
import { TheMovieDbService } from '../../plugins/the-movie-db/the-movie-db.service';

const envPath = path.resolve(__dirname, '../../../.env');

type MockModel<T = any> = Partial<Record<keyof Model<T>, jest.Mock>>;
const createMockModel = <T = any>(): MockModel<T> => ({});

type MockTheMovieDbService = Partial<
  Record<keyof TheMovieDbService, jest.Mock>
>;
const createMockTheMovieDbService = (): MockTheMovieDbService => ({});

describe('MovieService', () => {
  let service: MovieService;
  let movieModel: MockModel<Movie>;
  let theMovieDbService: MockTheMovieDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
          envFilePath: envPath,
        }),
      ],
      providers: [
        MovieService,
        {
          provide: getModelToken(Movie.name),
          useValue: createMockModel(),
        },
        {
          provide: TheMovieDbService,
          useValue: createMockTheMovieDbService(),
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieModel = module.get<MockModel<Movie>>(getModelToken(Movie.name));
    theMovieDbService = module.get<MockTheMovieDbService>(TheMovieDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ingestMovies', () => {
    const movies: Partial<Movie>[] = [
      { movieApiId: 1, title: 'Movie 1' },
      { movieApiId: 2, title: 'Movie 2' },
    ];

    it('should ingest movies and log the success message', async () => {
      movieModel.findOneAndUpdate = jest.fn().mockResolvedValueOnce(undefined);

      await service.ingestMovies(movies as Movie[]);

      expect(movieModel.findOneAndUpdate).toHaveBeenCalledTimes(2);
    });

    it('should log an error message if an error occurs', async () => {
      const error = new Error('Failed to ingest movies');
      movieModel.findOneAndUpdate = jest.fn().mockRejectedValueOnce(error);

      Logger.log = jest.fn();
      Logger.error = jest.fn();

      await service.ingestMovies(movies as Movie[]);

      expect(Logger.log).toHaveBeenCalledWith(
        'error ingesting movies',
        'MovieService',
      );
      expect(Logger.error).toHaveBeenCalledWith(error, 'MovieService');
    });
  });

  describe('getPopularMovies', () => {
    const response = {
      results: [{ movieApiId: 1, title: 'Movie 1' }],
    };

    it('should get popular movies and ingest them', async () => {
      theMovieDbService.getPopularMovies = jest
        .fn()
        .mockResolvedValueOnce(response);
      service.ingestMovies = jest.fn();

      const result = await service.getPopularMovies({ page: '1' });

      expect(result).toEqual(response);
      expect(service.ingestMovies).toHaveBeenCalledWith(response.results);
    });
  });

  describe('searchMovies', () => {
    const response = {
      results: [{ movieApiId: 1, title: 'Movie 1' }],
    };

    it('should search movies and ingest them', async () => {
      theMovieDbService.searchMovies = jest
        .fn()
        .mockResolvedValueOnce(response);
      service.ingestMovies = jest.fn();

      const result = await service.searchMovies({
        language: 'en-US',
        query: 'Movie',
        page: '1',
      });

      expect(result).toEqual(response);
      expect(service.ingestMovies).toHaveBeenCalledWith(response.results);
    });
  });

  describe('getMoviesByApiIds', () => {
    const movieApiIds = [1, 2];
    const movies: Partial<Movie>[] = [
      { movieApiId: 1, title: 'Movie 1' },
      { movieApiId: 2, title: 'Movie 2' },
    ];

    it('should get movies by API IDs', async () => {
      movieModel.find = jest.fn().mockResolvedValueOnce(movies);

      const result = await service.getMoviesByApiIds(movieApiIds);

      expect(result).toEqual(movies);
      expect(movieModel.find).toHaveBeenCalledWith({
        movieApiId: { $in: movieApiIds },
      });
    });
  });

  describe('getMovieByApiId', () => {
    const movieApiId = 1;
    const movie: Partial<Movie> = { movieApiId, title: 'Movie 1' };

    it('should get a movie by API ID', async () => {
      movieModel.findOne = jest.fn().mockResolvedValueOnce(movie);

      const result = await service.getMovieByApiId(movieApiId);

      expect(result).toEqual(movie);
      expect(movieModel.findOne).toHaveBeenCalledWith({ movieApiId });
    });
  });
});
