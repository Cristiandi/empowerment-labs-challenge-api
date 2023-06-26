import * as path from 'path';

import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { MovieNote } from './movie-note.schema';

import { MovieNoteService } from './movie-note.service';
import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const envPath = path.resolve(__dirname, '../../../.env');

type MockModel<T = any> = Partial<Record<keyof Model<T>, jest.Mock>>;
const createMockModel = <T = any>(): MockModel<T> => ({});

type MockUserService = Partial<Record<keyof UserService, jest.Mock>>;
const createMockUserService = (): MockUserService => ({});

type MockMovieService = Partial<Record<keyof MovieService, jest.Mock>>;
const createMockMovieService = (): MockMovieService => ({});

describe('MovieNoteService', () => {
  let service: MovieNoteService;
  let movieNoteModel: MockModel<MovieNote>;
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
        MovieNoteService,
        {
          provide: getModelToken(MovieNote.name),
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

    service = module.get<MovieNoteService>(MovieNoteService);
    movieNoteModel = module.get<MockModel<MovieNote>>(
      getModelToken(MovieNote.name),
    );
    userService = module.get<MockUserService>(UserService);
    movieService = module.get<MockMovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const input = {
      userAuthUid: 'user-auth-uid',
      movieApiId: 1,
      title: 'Movie Note Title',
      description: 'Movie Note Description',
      imageUrl: 'https://example.com/image.jpg',
    };
    const existingUser = { id: 'user-id' };
    const existingMovie = { id: 'movie-id' };
    const createdMovieNote = {
      id: 'movie-note-id',
      user: existingUser,
      movie: existingMovie,
      save: undefined,
    };

    it('should create a movie note', async () => {
      userService.getUserByAuthUid = jest
        .fn()
        .mockResolvedValueOnce(existingUser);
      movieService.getMovieByApiId = jest
        .fn()
        .mockResolvedValueOnce(existingMovie);
      movieNoteModel.create = jest.fn().mockResolvedValueOnce(createdMovieNote);
      createdMovieNote.save = jest.fn().mockResolvedValueOnce(createdMovieNote);

      const result = await service.create(input);

      expect(result).toEqual(createdMovieNote);
      expect(movieNoteModel.create).toHaveBeenCalledWith({
        user: existingUser,
        movie: existingMovie,
        title: input.title,
        description: input.description,
        imageUrl: input.imageUrl,
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      userService.getUserByAuthUid = jest.fn().mockResolvedValueOnce(undefined);

      await expect(service.create(input)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if movie is not found', async () => {
      userService.getUserByAuthUid = jest
        .fn()
        .mockResolvedValueOnce(existingUser);
      movieService.getMovieByApiId = jest.fn().mockResolvedValueOnce(undefined);

      await expect(service.create(input)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const getOneMovieNoteInput = { id: '6496813834f15a4517a6bb56' };
    const input = {
      title: 'Updated Movie Note Title',
      description: 'Updated Movie Note Description',
      imageUrl: 'https://example.com/updated-image.jpg',
    };
    const existingMovieNote = {
      id: 'movie-note-id',
      title: 'Movie Note Title',
      save: undefined,
    };
    const updatedMovieNote = { ...existingMovieNote, ...input };

    it('should update a movie note', async () => {
      movieNoteModel.findById = jest
        .fn()
        .mockResolvedValueOnce(existingMovieNote);
      existingMovieNote.save = jest
        .fn()
        .mockResolvedValueOnce(updatedMovieNote);

      const result = await service.update(getOneMovieNoteInput, input);

      expect(result).toEqual(updatedMovieNote);
      expect(movieNoteModel.findById).toHaveBeenCalledWith(
        getOneMovieNoteInput.id,
      );
      expect(existingMovieNote.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if movie note is not found', async () => {
      movieNoteModel.findById = jest.fn().mockResolvedValueOnce(undefined);

      await expect(
        service.update(getOneMovieNoteInput, input),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw BadRequestException if invalid id is provided', async () => {
      const invalidId = 'invalid-id';
      getOneMovieNoteInput.id = invalidId;

      await expect(
        service.update(getOneMovieNoteInput, input),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
