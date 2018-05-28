import { cold } from 'jasmine-marbles';

export function c<T>(val: T) {
  return cold('a', { a: val });
}
