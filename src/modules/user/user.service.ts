import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import appConfig from '../../config/app.config';

import { User, UserDocument } from './user.schema';

import { SignUpUserInput } from './dto/sign-up-user-input.dto';
import { BasicAclService } from 'nestjs-basic-acl-sdk';

@Injectable()
export class UserService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
    private readonly basicAclService: BasicAclService,
  ) {}

  public async signUp(input: SignUpUserInput) {
    const { email, name, password } = input;
    const { acl: aclConfig } = this.appConfiguration;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException('user already exists');
    }

    const aclUser = await this.basicAclService.createUser({
      email,
      password,
      roleCode: aclConfig.roles.userCode,
    });

    try {
      const createdUser = await this.userModel.create({
        authUid: aclUser.authUid,
        email,
        name,
      });

      const savedUser = await createdUser.save();

      return savedUser;
    } catch (error) {
      Logger.warn('deleting the user in ACL', UserService.name);

      await this.basicAclService.deleteUser({
        authUid: aclUser.authUid,
      });

      throw error;
    }
  }

  public async getUserByAuthUid(authUid: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ authUid });

    return user;
  }
}
