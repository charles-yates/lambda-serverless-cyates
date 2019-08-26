// tslint:disable
/**
 * Contains helper methods to generate a HTTP response.
 */
export class DynamodbResponse {
    public static formatData(dataObject: object): object {
        const data: object = {};
        const keys: string[] = Object.keys(dataObject);

        keys.forEach(function(key: string): void {
            const prop: object = dataObject[key];
            const propKeys: string[] = Object.keys(prop);

            switch (propKeys[0]) {
                case 'N':
                    data[key] = parseInt(prop[propKeys[0]], 10);
                    break;
                case 'S':
                default:
                    data[key] = prop[propKeys[0]];
            }
        });

        return data;
    }
}
