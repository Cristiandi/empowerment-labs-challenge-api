import * as path from 'path';

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import appConfig from '../../config/app.config';

import { TheMovieDbService } from './the-movie-db.service';

const envPath = path.resolve(__dirname, '../../../.env');

type MockHttpService = Partial<Record<keyof HttpService, jest.Mock>>;
const createMockHttpService = (): MockHttpService => ({});

describe('TheMovieDbService', () => {
  let service: TheMovieDbService;
  let httpService: MockHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
          envFilePath: envPath,
        }),
      ],
      providers: [
        TheMovieDbService,
        {
          provide: HttpService,
          useValue: createMockHttpService(),
        },
      ],
    }).compile();

    service = module.get<TheMovieDbService>(TheMovieDbService);
    httpService = module.get<MockHttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
