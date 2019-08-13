import { Movie } from './movies.interfaces';

export class MoviesRepository {
    public exists(id: number): boolean {
        return id > 0;
    }

    public getMovie(id: number): Movie {
        return {
            format: 'DVD',
            id,
            length: 120,
            rating: 5,
            title: 'Best Movie',
            year: 2019
        };
    }
}
