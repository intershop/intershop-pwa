import { cold } from 'jasmine-marbles';

export function c(val: any) {
  return cold('a', { a: val });
}
