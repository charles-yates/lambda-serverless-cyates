// tslint:disable
import { AWSError, DynamoDB } from 'aws-sdk';
import { v1 as uuidv1 } from 'uuid';
import { Movie } from './movies.interfaces';
import { DynamodbResponse } from '../../shared/dynamodb-response';

export class MoviesRepository {
    private ddb: DynamoDB = new DynamoDB({
        apiVersion: '2012-08-10',
        region: 'us-east-1'
    });

    public deleteMovie(id: string): Promise<string> {
        const params: DynamoDB.Types.DeleteItemInput = {
            Key: {
                'movieId': {S: id}
            },
            TableName: 'movies'
        };

        let message = '';

        return new Promise<string>(resolve => {
            this.ddb.deleteItem(params, function (err: AWSError, data: DynamoDB.Types.DeleteItemOutput) {
                if (err) {
                    message = 'error';
                } else {
                    message = 'success';
                }
                resolve(message);
            });
        });
    }

    public async exists(id: string): Promise<boolean> {
        const params: DynamoDB.Types.GetItemInput = {
            Key: {
                'movieId': {S: id}
            },
            TableName: 'movies'
        };

        return new Promise<boolean>(resolve => {
            this.ddb.getItem(params, function(err: AWSError, data: DynamoDB.Types.GetItemOutput) {
                resolve(!err);
            });
        });
    }

    public async getMovie(id: string): Promise<Movie> {
        const params: DynamoDB.Types.GetItemInput = {
            Key: {
                'movieId': {S: id}
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

    public patchMovie(id: string, movie: Movie): Promise<Movie> {
        const params: DynamoDB.Types.UpdateItemInput = {
            Key: {
                'movieId': {S: id}
            },
            TableName: 'movies',
            UpdateExpression: 'set format = :f, length = :l, rating = :r, title = :t, year = :y',
            ExpressionAttributeValues: {
                ':f': {S: movie.format},
                ':l': {N: movie.length.toString()},
                ':r': {N: movie.rating.toString()},
                ':t': {S: movie.title},
                ':y': {N: movie.year.toString()}
            }
        };

        return new Promise<Movie>(resolve => {
            this.ddb.updateItem(params, function(err: AWSError, data: DynamoDB.Types.UpdateItemOutput) {
                if(!err) {
                    resolve(movie);
                }
            });
        });
    }

    public putMovie(movie: Movie): Promise<Movie> {
        const movieId: string = uuidv1();
        const params: DynamoDB.Types.PutItemInput = {
            TableName: 'movies',
            Item: {
                'format': {S: movie.format},
                'length': {N: movie.length.toString()},
                'movieId': {S: movieId},
                'rating': {N: movie.rating.toString()},
                'title': {S: movie.title},
                'year': {N: movie.year.toString()}
            }
        };

        return new Promise<Movie>(resolve => {
            this.ddb.putItem(params, function(err: AWSError, data: DynamoDB.Types.PutItemOutput) {
                if (!err) {
                    resolve(movie);
                }
            });
        });
    }
}
