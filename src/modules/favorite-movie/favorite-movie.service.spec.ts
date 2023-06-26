import * as path from 'path';

import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConflictException, NotFoundException } from '@nestjs/common';

import appConfig from '../../config/app.config';

import { FavoriteMovie } from './favorite-movie.schema';

import { FavoriteMovieService } from './favorite-movie.service';
import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';

const envPath = path.resolve(__dirname, '../../../.env');

type MockModel<T = any> = Partial<Record<keyof Model<T>, jest.Mock>>;
const createMockModel = <T = any>(): MockModel<T> => ({});

type MockUserService = Partial<Record<keyof UserService, jest.Mock>>;
const createMockUserService = (): MockUserService => ({});

type MockMovieService = Partial<Record<keyof MovieService, jest.Mock>>;
const createMockMovieService = (): MockMovieService => ({});

describe('FavoriteMovieService', () => {
  let service: FavoriteMovieService;
  let favoriteMovieModel: MockModel<FavoriteMovie>;
  let userService: MockUserService;
  let movieService: MockMovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
          envFilePath: envPath,
        }),
      ],
      providers: [
        FavoriteMovieService,
        {
          provide: getModelToken(FavoriteMovie.name),
          useValue: createMockModel(),
        },
        {
          provide: UserService,
          useValue: createMockUserService(),
        },
        {
          provide: MovieService,
          useValue: createMockMovieService(),
        },
      ],
    }).compile();

    service = module.get<FavoriteMovieService>(FavoriteMovieService);
    favoriteMovieModel = module.get<MockModel<FavoriteMovie>>(
      getModelToken(FavoriteMovie.name),
    );
    userService = module.get<MockUserService>(UserService);
    movieService = module.get<MockMovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addFavoriteMovies', () => {
    const userAuthUid = 'user-auth-uid';
    const movieApiIds = [121, 123];

    it('should throw NotFoundException if user does not exist', async () => {
      userService.getUserByAuthUid = jest.fn().mockResolvedValueOnce(undefined);

      await expect(
        service.addFavoriteMovies({
          userAuthUid,
          movieApiIds,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if one or more movies do not exist', async () => {
      const existingUser = { id: 'user-id' };
      const existingMovies = [{ id: 'movie-id' }];

      userService.getUserByAuthUid = jest
        .fn()
        .mockResolvedValueOnce(existingUser);
      movieService.getMoviesByApiIds = jest
        .fn()
        .mockResolvedValueOnce(existingMovies);
      movieService.getMoviesByApiIds = jest.fn().mockResolvedValueOnce([]);

      await expect(
        service.addFavoriteMovies({
          userAuthUid,
          movieApiIds,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if a movie is already favorited', async () => {
      const existingUser = { id: 'user-id' };
      const existingMovies = [
        { id: 'movie-id', movieApiId: 121 },
        { id: 'movie-id', movieApiId: 123 },
      ];

      userService.getUserByAuthUid = jest
        .fn()
        .mockResolvedValueOnce(existingUser);
      movieService.getMoviesByApiIds = jest
        .fn()
        .mockResolvedValueOnce(existingMovies);
      favoriteMovieModel.findOne = jest.fn().mockResolvedValueOnce({});

      await expect(
        service.addFavoriteMovies({
          userAuthUid,
          movieApiIds,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and save favorite movies', async () => {
      const existingUser = { id: 'user-id' };
      const existingMovies = [{ id: 'movie-id' }, { id: 'movie-id' }];

      userService.getUserByAuthUid = jest
        .fn()
        .mockResolvedValueOnce(existingUser);
      movieService.getMoviesByApiIds = jest
        .fn()
        .mockResolvedValueOnce(existingMovies);
      favoriteMovieModel.findOne = jest.fn().mockResolvedValueOnce(undefined);
      favoriteMovieModel.create = jest
        .fn()
        .mockResolvedValueOnce([{ id: 'favorite-movie-id' }]);
      favoriteMovieModel.bulkSave = jest.fn().mockResolvedValueOnce({});

      const result = await service.addFavoriteMovies({
        userAuthUid,
        movieApiIds,
      });

      expect(result).toEqual([{ id: 'favorite-movie-id' }]);
    });
  });
});
