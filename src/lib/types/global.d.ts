/* eslint-disable no-var */

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export {};
