import { ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { GetMovieResult, GetMoviesResult, Movie } from './movies.interfaces';
import { MoviesRepository } from './movies.repository';

export class MoviesService {
    public constructor(private readonly _repo: MoviesRepository) {}

    public getMovie(id: number): Promise<GetMovieResult> {
        return new Promise((resolve: (result: GetMovieResult) => void, reject: (reason: NotFoundResult) => void): void => {
            if (!this._repo.exists(id)) {
                reject(new NotFoundResult('UNKNOWN_MOVIE', 'There is no movie with the specified ID.'));
                return;
            }

            // TODO: implement auth later
            reject(new ForbiddenResult('PERMISSION_REQUIRED', 'You have no permission to access this record.'));

            const movie: Movie = this._repo.getMovie(id);
            const result: GetMovieResult = {
                movie
            };

            resolve(result);
        });
    }

    public getMovies(): Promise<GetMoviesResult> {
        return new Promise((resolve: (result: GetMoviesResult) => void): void => {
            const movies: Movie[] = this._repo.getMovies();
            const result: GetMoviesResult = {
                movies
            };

            resolve(result);
        });
    }

    public patchMovie(id: number, movie: Movie): Promise<GetMovieResult> {
        return new Promise((resolve: (result: GetMovieResult) => void, reject: (reason: NotFoundResult) => void): void => {
            if (!this._repo.exists(id)) {
                reject(new NotFoundResult('UNKNOWN_MOVIE', 'There is no movie with the specified ID.'));
                return;
            }

            const patchedMovie: Movie = this._repo.patchMovie(id, movie);
            const result: GetMovieResult = {
                movie: patchedMovie
            };

            resolve(result);
        });
    }

    public putMovie(movie: Movie): Promise<GetMovieResult> {
        return new Promise((resolve: (result: GetMovieResult) => void): void => {
            const newMovie: Movie = this._repo.putMovie(movie);
            const result: GetMovieResult = {
                movie: newMovie
            };

            resolve(result);
        });
    }
}
