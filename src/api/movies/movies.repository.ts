// tslint:disable
import { AWSError, DynamoDB } from 'aws-sdk';
import { Movie } from './movies.interfaces';
import { DynamodbResponse } from '../../shared/dynamodb-response';

export class MoviesRepository {
    private ddb: DynamoDB = new DynamoDB({
        apiVersion: '2012-08-10',
        region: 'us-east-1'
    });

    public async exists(id: number): Promise<boolean> {
        const params: DynamoDB.Types.GetItemInput = {
            Key: {
                'movieId': {N: id.toString()}
            },
            TableName: 'movies'
        };

        return new Promise<boolean>(resolve => {
            this.ddb.getItem(params, function(err: AWSError, data: DynamoDB.Types.GetItemOutput) {
                resolve(!err);
            });
        });
    }

    public async getMovie(id: number): Promise<Movie> {
        const params: DynamoDB.Types.GetItemInput = {
            Key: {
                'movieId': {N: id.toString()}
            },
            TableName: 'movies'
        };

        return new Promise<Movie>(resolve => {
            this.ddb.getItem(params, function(err: AWSError, data: DynamoDB.Types.GetItemOutput) {
                if (!err) {
                    const movie = DynamodbResponse.formatData(data.Item);
                    resolve({
                        format: movie.format,
                        length: movie.length,
                        id: movie.movieId,
                        rating: movie.rating,
                        title: movie.title,
                        year: movie.year
                    });
                }
            });
        });
    }

    public async getMovies(): Promise<Movie[]> {
        const params: DynamoDB.Types.ScanInput = {
            TableName: 'movies'
        };

        return new Promise<Movie[]>(resolve => {
            this.ddb.scan(params, function(err: AWSError, data: DynamoDB.Types.ScanOutput) {
                let movies: Movie[] = [];
                if (!err) {
                    data.Items.forEach(function(item) {
                        const movie = DynamodbResponse.formatData(item);
                        movies.push({
                            format: movie.format,
                            length: movie.length,
                            id: movie.movieId,
                            rating: movie.rating,
                            title: movie.title,
                            year: movie.year
                        });
                    });
                }
                resolve(movies);
            });
        });
    }

    public putMovie(movie: Movie): Movie {
        const params: DynamoDB.Types.PutItemInput = {
            TableName: 'movies',
            Item: {
                'format': {S: movie.format},
                'length': {N: movie.length.toString()},
                'rating': {N: movie.rating.toString()},
                'title': {S: movie.title},
                'year': {N: movie.year.toString()}
            }
        };

        let newMovie = movie;

        this.ddb.putItem(params, function(err: AWSError, data: DynamoDB.Types.PutItemOutput) {
            if (err) {
                newMovie = {
                    format: '',
                    id: 0,
                    length: 0,
                    rating: 0,
                    title: '',
                    year: 0
                };
            }
        });

        return newMovie;
    }

    public patchMovie(id: number, movie: Movie): Movie {
        const params: DynamoDB.Types.UpdateItemInput = {
            Key: {
                'movieId': {N: id.toString()}
            },
            TableName: 'movies',
            UpdateExpression: 'set format = :f, length = :l, rating = :r, title = :t, year = :y',
            ExpressionAttributeValues: {
                ':f': {S: movie.format},
                ':l': {N: movie.length.toString()},
                ':r': {N: movie.rating.toString()},
                ':t': {S: movie.title},
                ':y': {N: movie.year.toString()}
            },
            ReturnValues: 'UPDATED_NEW'
        };

        let patchedMovie = movie;

        this.ddb.updateItem(params, function(err: AWSError, data: DynamoDB.Types.UpdateItemOutput) {
            if(err) {
                patchedMovie = {
                    format: '',
                    id: 0,
                    length: 0,
                    rating: 0,
                    title: '',
                    year: 0
                };
            }
        });

        return patchedMovie;
    }

    public deleteMovie(id: number): string {
        const params: DynamoDB.Types.DeleteItemInput = {
            Key: {
                'movieId': {N: id.toString()}
            },
            TableName: 'movies'
        };

        let message = '';

        this.ddb.deleteItem(params, function(err: AWSError, data: DynamoDB.Types.DeleteItemOutput) {
            if (err) {
                message = 'error';
            } else {
                message = 'success';
            }
        });

        return message;
    }
}
