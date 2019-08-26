// tslint:disable
import { instance, mock, reset, when } from 'ts-mockito';

import { ErrorResult, NotFoundResult } from '../../shared/errors';
import { GetMovieResult, Movie } from './movies.interfaces';
import { MoviesRepository } from './movies.repository';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
    const moviesRepositoryMock: MoviesRepository = mock(MoviesRepository);
    const moviesRepositoryMockInstance: MoviesRepository = instance(moviesRepositoryMock);
    let service: MoviesService;
    let testMovie: Movie;

    beforeEach(() => {
        reset(moviesRepositoryMock);
        service = new MoviesService(moviesRepositoryMockInstance);
        testMovie = {
            format: 'DVD',
            id: 1,
            length: 120,
            rating: 5,
            title: 'Best Movie',
            year: 2019
        };
    });

    describe('getMovie function', () => {
        it('should resolve with the input id', async () => {
            when(moviesRepositoryMock.exists(testMovie.id)).thenReturn(true);
            when(moviesRepositoryMock.getMovie(testMovie.id)).thenReturn(testMovie);

            const result: GetMovieResult = await service.getMovie(testMovie.id);
            expect(result.movie.id).to.equal(testMovie.id);
        });
    });

    it('should reject for non-existing ID', () => {\
        // tslint:disable no-magic-numbers
        const id: number = Math.floor((Math.random() * 100) + 1);
        when(moviesRepositoryMock.exists(id)).thenReturn(false);

        service.getMovie(id)
            .catch((error: ErrorResult) => {
                expect(error instanceof NotFoundResult).to.equal(true);
            });
    });
});
