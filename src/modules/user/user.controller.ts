import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from 'nestjs-basic-acl-sdk';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';

import { SignUpUserInput } from './dto/sign-up-user-input.dto';

// reponse types
import { User } from './user.schema';

@ApiTags('users')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiOperation({
    summary: 'Sign up a new user',
  })
  @Public()
  @Post()
  signUp(@Body() input: SignUpUserInput) {
    return this.userService.signUp(input);
  }
}
