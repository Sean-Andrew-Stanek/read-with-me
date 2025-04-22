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

// validation rules for password creation
export const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
    );
};
