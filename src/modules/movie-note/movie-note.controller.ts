import {
  Body,
  Controller,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionName } from 'nestjs-basic-acl-sdk';

import { MovieNoteService } from './movie-note.service';

import { CreateMovieNoteInput } from './dto/create-movie-note-input.dto';
import { GetOneMovieNoteInput } from './dto/get-one-movie-note-input.dto';
import { UpdateMovieNoteInput } from './dto/update-movie-note-input.dto';

// reponse types
import { MovieNote } from './movie-note.schema';

@ApiTags('movie-notes')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('movie-notes')
export class MovieNoteController {
  constructor(private readonly movieNoteService: MovieNoteService) {}

  @ApiResponse({
    status: 201,
    description: 'The movie note has been successfully created.',
    type: MovieNote,
  })
  @ApiOperation({
    summary: 'Create a movie note',
  })
  @PermissionName('movieNotes:create')
  @Post()
  create(@Body() input: CreateMovieNoteInput) {
    return this.movieNoteService.create(input);
  }

  @ApiResponse({
    status: 200,
    description: 'The movie note has been successfully updated.',
    type: MovieNote,
  })
  @ApiOperation({
    summary: 'Update a movie note',
  })
  @PermissionName('movieNotes:update')
  @Patch()
  update(
    @Query() getOneMovieNoteInput: GetOneMovieNoteInput,
    @Body() input: UpdateMovieNoteInput,
  ) {
    return this.movieNoteService.update(getOneMovieNoteInput, input);
  }
}
