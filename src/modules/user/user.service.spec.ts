import * as path from 'path';

import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BasicAclService } from 'nestjs-basic-acl-sdk';
import { ConflictException } from '@nestjs/common';

import appConfig from '../../config/app.config';

import { User } from './user.schema';

import { UserService } from './user.service';

const envPath = path.resolve(__dirname, '../../../.env');

type MockModel<T = any> = Partial<Record<keyof Model<T>, jest.Mock>>;
const createMockModel = <T = any>(): MockModel<T> => ({});

type MockBasicAclService = Partial<Record<keyof BasicAclService, jest.Mock>>;
const createMockBasicAclService = (): MockBasicAclService => ({});

describe('UserService', () => {
  let service: UserService;
  let userModel: MockModel<User>;
  let basicAclService: MockBasicAclService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
          envFilePath: envPath,
        }),
      ],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: createMockModel(),
        },
        {
          provide: BasicAclService,
          useValue: createMockBasicAclService(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<MockModel<User>>(getModelToken(User.name));
    basicAclService = module.get<MockBasicAclService>(BasicAclService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const input = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password',
    };

    const existingUser = { id: 'user-id' };
    const aclUser = { authUid: 'acl-auth-uid' };
    const createdUser = {
      id: 'created-user-id',
      ...input,
      authUid: aclUser.authUid,
      save: undefined,
    };

    it('should create a user and return the saved user', async () => {
      userModel.findOne = jest.fn().mockResolvedValueOnce(undefined);
      basicAclService.createUser = jest.fn().mockResolvedValueOnce(aclUser);
      userModel.create = jest.fn().mockReturnValueOnce(createdUser);
      createdUser.save = jest.fn().mockResolvedValueOnce(createdUser);

      const result = await service.signUp(input);

      expect(createdUser.save).toHaveBeenCalled();
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      userModel.findOne = jest.fn().mockResolvedValueOnce(existingUser);

      await expect(service.signUp(input)).rejects.toThrowError(
        ConflictException,
      );
    });

    it('should throw an error and delete the user in ACL if there is an error during user creation', async () => {
      userModel.findOne = jest.fn().mockResolvedValueOnce(undefined);
      basicAclService.createUser = jest.fn().mockResolvedValueOnce(aclUser);
      userModel.create = jest
        .fn()
        .mockRejectedValueOnce(new Error('Database error'));
      basicAclService.deleteUser = jest.fn();

      await expect(service.signUp(input)).rejects.toThrowError(Error);
      expect(basicAclService.deleteUser).toHaveBeenCalledWith({
        authUid: aclUser.authUid,
      });
    });
  });

  describe('getUserByAuthUid', () => {
    const authUid = 'user-auth-uid';
    const existingUser = { id: 'user-id', authUid };

    it('should return the user with the specified authUid', async () => {
      userModel.findOne = jest.fn().mockResolvedValueOnce(existingUser);

      const result = await service.getUserByAuthUid(authUid);

      expect(result).toEqual(existingUser);
      expect(userModel.findOne).toHaveBeenCalledWith({ authUid });
    });

    it('should return undefined if user with the specified authUid is not found', async () => {
      userModel.findOne = jest.fn().mockResolvedValueOnce(undefined);

      const result = await service.getUserByAuthUid(authUid);

      expect(result).toBeUndefined();
      expect(userModel.findOne).toHaveBeenCalledWith({ authUid });
    });
  });
});
