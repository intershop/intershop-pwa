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

/**
 * Convert object to array containing objects with key and value
 * @param values  The object
 * @returns       The converted array
 */
export const objectToArray = (values: { [key: string]: string }) =>
  Object.keys(values).map(key => ({ key, value: values[key] }));

export const toObservable = <T>(input: T | Observable<T>): Observable<T> => (isObservable(input) ? input : of(input));
