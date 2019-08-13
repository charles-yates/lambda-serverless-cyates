import { ApiCallback, ApiContext, ApiEvent, ApiHandler } from '../../shared/api.interfaces';
import { ErrorCode } from '../../shared/error-codes';
import { ErrorResult, ForbiddenResult, NotFoundResult } from '../../shared/errors';
import { ResponseBuilder } from '../../shared/response-builder';
import { GetMovieResult } from './movies.interfaces';
import { MoviesService } from './movies.service';

export class MoviesController {
    public constructor(private readonly _service: MoviesService) {}

    public getMovie: ApiHandler = (event: ApiEvent, context: ApiContext, callback: ApiCallback): void => {
        // Input validation.
        if (!event.pathParameters || !event.pathParameters.id) {
            return ResponseBuilder.badRequest(ErrorCode.MissingId, 'Please specify the movie ID.', callback);
        }

        if (isNaN(+event.pathParameters.id)) {
            return ResponseBuilder.badRequest(ErrorCode.InvalidId, 'The movie ID must be a number.', callback);
        }

        const id: number = +event.pathParameters.id;
        this._service.getMovie(id)
            .then((result: GetMovieResult) => {
                return ResponseBuilder.ok<GetMovieResult>(result, callback);
            })
            .catch((error: ErrorResult) => {
                if (error instanceof NotFoundResult) {
                    return ResponseBuilder.notFound(error.code, error.description, callback);
                }

                if (error instanceof ForbiddenResult) {
                    return ResponseBuilder.forbidden(error.code, error.description, callback);
                }

                return ResponseBuilder.internalServerError(error, callback);
            });
    }
}
