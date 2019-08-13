
export interface Movie {
    format: string;
    id: number;
    length: number;
    rating: number;
    title: string;
    year: number;
}

export interface GetMovieResult {
    movie: Movie;
}
