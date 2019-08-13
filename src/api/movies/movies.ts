import { ApiHandler } from '../../shared/api.interfaces';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';
import { MoviesService } from './movies.service';

const repo: MoviesRepository = new MoviesRepository();
const service: MoviesService = new MoviesService(repo);
const controller: MoviesController = new MoviesController(service);

export const getMovie: ApiHandler = controller.getMovie;