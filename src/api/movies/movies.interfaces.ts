
export interface Movie {
    format: string;
    id: string;
    length: number;
    rating: number;
    title: string;
    year: number;
}

export interface GetMovieResult {
    movie: Movie;
}

export interface GetMoviesResult {
    movies: Movie[];
}
