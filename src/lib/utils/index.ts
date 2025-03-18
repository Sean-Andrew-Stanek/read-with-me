import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type MongoDoc<T> = T & { _id?: unknown };

export const sanitizeDoc = <T>(doc: MongoDoc<T>): Omit<MongoDoc<T>, '_id'> => {
    const { _id, ...clean } = doc;
    return clean;
};

export const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs));
};
