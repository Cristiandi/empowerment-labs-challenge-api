import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionName } from 'nestjs-basic-acl-sdk';

import { MovieService } from './movie.service';

import { GetPopularMoviesInput } from './dto/get-popular-movies-input.dto';
import { SearchMoviesInput } from './dto/search-movies-input.dto';

// reponse types
import { MoviesOutput } from '../../plugins/the-movie-db/dto/movies-output.dto';

@ApiTags('movies')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiResponse({
    status: 200,
    description: 'The list of popular movies has been successfully retrieved.',
    type: MoviesOutput,
  })
  @ApiOperation({
    summary: 'Get popular movies',
  })
  @PermissionName('movies:getPopularMovies')
  @Get('popular')
  getPopularMovies(@Query() input: GetPopularMoviesInput) {
    return this.movieService.getPopularMovies(input);
  }

  @ApiResponse({
    status: 200,
    description: 'The list of movies has been successfully retrieved.',
    type: MoviesOutput,
  })
  @ApiOperation({
    summary: 'Search movies',
  })
  @PermissionName('movies:searchMovies')
  @Get('search')
  searchMovies(@Query() input: SearchMoviesInput) {
    return this.movieService.searchMovies(input);
  }
}
