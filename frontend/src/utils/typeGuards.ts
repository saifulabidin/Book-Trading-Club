import { User, Book, Trade } from '../types';

export function isUser(obj: any): obj is User {
  return obj && 
    typeof obj === 'object' &&
    typeof obj._id === 'string' &&
    typeof obj.username === 'string';
}

export function isBook(obj: any): obj is Book {
  return obj && 
    typeof obj === 'object' &&
    typeof obj._id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.author === 'string';
}

export function isTrade(obj: any): obj is Trade {
  return obj && 
    typeof obj === 'object' &&
    typeof obj._id === 'string' &&
    (typeof obj.initiator === 'string' || isUser(obj.initiator)) &&
    (typeof obj.receiver === 'string' || isUser(obj.receiver));
}
