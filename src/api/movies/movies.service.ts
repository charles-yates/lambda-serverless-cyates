// tslint:disable
import { NotFoundResult } from '../../shared/errors';
import { GetMovieResult, GetMoviesResult, Movie } from './movies.interfaces';
import { MoviesRepository } from './movies.repository';

export class MoviesService {
    public constructor(private readonly _repo: MoviesRepository) {}

    public deleteMovie(id: string): Promise<string> {
        return new Promise(async (resolve: (result: string) => void, reject: (reason: NotFoundResult) => void): void => {
            if (!this._repo.exists(id)) {
                reject(new NotFoundResult('UNKNOWN_MOVIE', 'There is no movie with the specified ID.'));
                return;
            }

            const response: string = await this._repo.deleteMovie(id);
            resolve(response);
        });
    }

    public getMovie(id: string): Promise<GetMovieResult> {
        return new Promise(async (resolve: (result: GetMovieResult) => void, reject: (reason: NotFoundResult) => void): void => {
            const exists: boolean = await this._repo.exists(id);
            if (!exists) {
                reject(new NotFoundResult('UNKNOWN_MOVIE', 'There is no movie with the specified ID.'));
                return;
            }

            // TODO: implement auth later
            // TODO: reject(new ForbiddenResult('PERMISSION_REQUIRED', 'You have no permission to access this record.'));

            const movie: Movie = await this._repo.getMovie(id);
            const result: GetMovieResult = {
                movie
            };

            resolve(result);
        });
    }

    public getMovies(): Promise<GetMoviesResult> {
        return new Promise(async (resolve: (result: GetMoviesResult) => void): void => {
            const movies: Movie[] = await this._repo.getMovies();
            const result: GetMoviesResult = {
                movies
            };

            resolve(result);
        });
    }

    public patchMovie(id: string, movie: Movie): Promise<GetMovieResult> {
        return new Promise(async (resolve: (result: GetMovieResult) => void, reject: (reason: NotFoundResult) => void): void => {
            if (!this._repo.exists(id)) {
                reject(new NotFoundResult('UNKNOWN_MOVIE', 'There is no movie with the specified ID.'));
                return;
            }

            const patchedMovie: Movie = await this._repo.patchMovie(id, movie);
            const result: GetMovieResult = {
                movie: patchedMovie
            };

            resolve(result);
        });
    }

    public putMovie(movie: Movie): Promise<GetMovieResult> {
        return new Promise(async (resolve: (result: GetMovieResult) => void): void => {
            const newMovie: Movie = await this._repo.putMovie(movie);
            const result: GetMovieResult = {
                movie: newMovie
            };

            resolve(result);
        });
    }
}
