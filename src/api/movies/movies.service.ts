import { ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { GetMovieResult, Movie } from './movies.interfaces';
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
}
