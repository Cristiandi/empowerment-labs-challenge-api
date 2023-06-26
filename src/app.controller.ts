import { Controller, Get } from '@nestjs/common';
import { Public } from 'nestjs-basic-acl-sdk';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('default')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    status: 200,
    description: 'The Hello World! greeting has been successfully retrieved.',
    type: String,
  })
  @ApiOperation({
    summary: 'Get Hello World! greeting',
  })
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
