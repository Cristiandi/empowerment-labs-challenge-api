import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BasicAclModule } from 'nestjs-basic-acl-sdk';

import appConfig from '../../config/app.config';

import { UserSchema } from './user.schema';

import { UserService } from './user.service';

import { UserController } from './user.controller';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    BasicAclModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          companyUid: configService.get<string>('config.acl.companyUid'),
          accessKey: configService.get<string>('config.acl.accessKey'),
        };
      },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
