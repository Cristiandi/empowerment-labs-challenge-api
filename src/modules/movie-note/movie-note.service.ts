import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import appConfig from '../../config/app.config';

import { MovieNoteDocument } from './movie-note.schema';

import { UserService } from '../user/user.service';
import { MovieService } from '../movie/movie.service';

import { CreateMovieNoteInput } from './dto/create-movie-note-input.dto';
import { GetOneMovieNoteInput } from './dto/get-one-movie-note-input.dto';
import { UpdateMovieNoteInput } from './dto/update-movie-note-input.dto';

@Injectable()
export class MovieNoteService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectModel('MovieNote')
    private readonly movieNoteModel: Model<MovieNoteDocument>,
    private readonly userService: UserService,
    private readonly movieService: MovieService,
  ) {}

  public async create(input: CreateMovieNoteInput) {
    const { userAuthUid, movieApiId, title, description, imageUrl } = input;

    // get user
    const existingUser = await this.userService.getUserByAuthUid(userAuthUid);

    // check if user exists
    if (!existingUser) {
      throw new NotFoundException('user not found');
    }

    // get movie
    const existingMovie = await this.movieService.getMovieByApiId(movieApiId);

    // check if movie exists
    if (!existingMovie) {
      throw new NotFoundException('movie not found');
    }

    // create the movie note
    const createdMovieNote = await this.movieNoteModel.create({
      user: existingUser,
      movie: existingMovie,
      title,
      description,
      imageUrl,
    });

    // save the movie note
    const savedMovieNote = await createdMovieNote.save();

    return savedMovieNote;
  }

  public async update(
    getOneMovieNoteInput: GetOneMovieNoteInput,
    input: UpdateMovieNoteInput,
  ) {
    const { id } = getOneMovieNoteInput;
    const { title, description, imageUrl } = input;

    if (!isValidObjectId(id)) {
      throw new BadRequestException('invalid id');
    }

    // get movie note
    const existingMovieNote = await this.movieNoteModel.findById(id);

    // check if movie note exists
    if (!existingMovieNote) {
      throw new NotFoundException('movie note not found');
    }

    // update the movie note
    existingMovieNote.title = title || existingMovieNote.title;
    existingMovieNote.description =
      description || existingMovieNote.description;
    existingMovieNote.imageUrl = imageUrl || existingMovieNote.imageUrl;

    // save the movie note
    const savedMovieNote = await existingMovieNote.save();

    return savedMovieNote;
  }
}
