// tslint:disable
import { AWS } from 'aws-sdk';
import { Movie } from './movies.interfaces';

export class MoviesRepository {
    private ddb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        region: 'us-east-1'
    });

    public exists(id: number): boolean {
        let exists:boolean = false;

        const params = {
            Key: {
                'movieId': {N: id}
            },
            TableName: 'movies'
        };

        this.ddb.getItem(params, function(err, data) {
            if(!err) {
                exists = true;
            }
        };

        return exists;
    }

    public getMovie(id: number): Movie {
        let movie:Movie = {
            format: '',
            length: 0,
            id: 0,
            rating: 0,
            title: '',
            year: 0
        };

        const params = {
            Key: {
                'movieId': {N: id}
            },
            TableName: 'movies'
        };

        this.ddb.getItem(params, function(err, data) {
            if (!err) {
                movie = {
                    format: data.Item.format,
                    length: data.Item.length,
                    id: data.Item.movieId,
                    rating: data.Item.rating,
                    title: data.Item.title,
                    year: data.Item.year
                };
            }
        });

        return movie;
    }

    public getMovies(): Movie[] {
        let movies:Movie[] = [];

        const params = {
            TableName: 'movies'
        };

        this.ddb.scan(params, function(err, data) {
            if (!err) {
                data.Items.forEach(function(item) {
                    movies.push({
                        format: item.format,
                        length: item.length,
                        id: item.movieId,
                        rating: item.rating,
                        title: item.title,
                        year: item.year
                    });
                });
            }
        });

        return movies;
    }

    public putMovie(movie: Movie): Movie {
        const params = {
            TableName: 'movies',
            Item: movie
        };

        let newMovie = movie;

        this.ddb.putItem(params, function(err, data) {
            if (!err) {
                newMovie = data.Item;
            }
        });

        return newMovie;
    }

    public patchMovie(id: number, movie: Movie): Movie {
        const params = {
            Key: {
                'movieId': {N: id}
            },
            TableName: 'movies',
            UpdateExpression: 'set format = :f, length = :l, rating = :r, title = :t, year = :y',
            ExpressionAttributeValues: {
                ':f': movie.format,
                ':l': movie.length,
                ':r': movie.rating,
                ':t': movie.title,
                ':y': movie.year
            },
            ReturnValues: 'UPDATED_NEW'
        };

        let patchedMovie = movie;

        this.ddb.updateItem(params, function(err, data) {
            if(!err) {
                patchedMovie = data.Item;
            }
        });

        return patchedMovie;
    }

    public deleteMovie(id: number) {
        const params = {
            Key: {
                'movieId': {N: id}
            },
            TableName: 'movies'
        };

        this.ddb.deleteItem(params, function(err, data) {
            if (err) {
                //error
            } else {
                //successfully deleted
            }
        });
    }
}
