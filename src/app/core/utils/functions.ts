import { range } from 'lodash-es';
import { Observable, isObservable, of } from 'rxjs';

/**
 * Returns an array of array slices with requested length.
 * Truncates whenever no complete remaining slice could be constructed.
 */
export const arraySlices = <T>(input: T[], sliceLength: number): T[][] =>
  input && input.length && sliceLength > 0
    ? // determine slice indexes
      range(0, Math.floor(input.length / sliceLength))
        // cut array into slices
        .map(n => input.slice(n * sliceLength, (n + 1) * sliceLength))
    : undefined;

export const toObservable = <T>(input: T | Observable<T>): Observable<T> => (isObservable(input) ? input : of(input));

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * @see https://stackoverflow.com/a/37164538/13001898
 */
export function mergeDeep(target, source) {
  let output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output = { ...output, [key]: source[key] };
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        output = { ...output, [key]: source[key] };
      }
    });
  }
  return output;
}
