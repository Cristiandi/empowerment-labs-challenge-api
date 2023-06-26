import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionName } from 'nestjs-basic-acl-sdk';

import { FavoriteMovieService } from './favorite-movie.service';

import { AddFavoriteMoviesInput } from './dto/add-favorite-movies-input';

// reponse types
import { FavoriteMovie } from './favorite-movie.schema';

@ApiTags('favorite-movies')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('favorite-movies')
export class FavoriteMovieController {
  constructor(private readonly favoriteMovieService: FavoriteMovieService) {}

  @ApiOperation({
    summary: 'Create list of favorite movies',
  })
  @ApiResponse({
    status: 201,
    description: 'The list of favorite movies has been successfully created.',
    type: [FavoriteMovie],
  })
  @PermissionName('favoriteMovies:create')
  @Post()
  createListOfFavoriteMovies(@Body() input: AddFavoriteMoviesInput) {
    return this.favoriteMovieService.addFavoriteMovies(input);
  }
}
