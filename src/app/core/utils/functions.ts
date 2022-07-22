import { range } from 'lodash-es';
import { Observable, isObservable, of } from 'rxjs';

/**
 * Returns an array of array slices with requested length.
 * Truncates whenever no complete remaining slice could be constructed.
 */
export const arraySlices = <T>(input: T[], sliceLength: number): T[][] =>
  input?.length && sliceLength > 0
    ? // determine slice indexes
      range(0, Math.ceil(input.length / sliceLength))
        // cut array into slices
        .map(n => input.slice(n * sliceLength, (n + 1) * sliceLength))
    : undefined;

export const toObservable = <T>(input: T | Observable<T>): Observable<T> => (isObservable(input) ? input : of(input));

function isObject(item: unknown) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * @see https://stackoverflow.com/a/37164538/13001898
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- utility function
export function mergeDeep(target: any, source: any): any {
  if (target === undefined && source === undefined) {
    return;
  }
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
  } else if (target === undefined) {
    return mergeDeep({}, source);
  }
  return output;
}

/**
 * Returns a copy of the object composed of the own and inherited enumerable property paths of the object that are not omitted.
 */
export function omit<T>(from: T, ...keys: (keyof T | string)[]) {
  return !!from && !Array.isArray(from)
    ? Object.entries(from)
        .filter(([key]) => !keys.includes(key))
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
    : from;
}

export function isArrayEqual<T>(a1: T[], a2: T[]): boolean {
  return (!a1 && !a2) || (a1?.length === a2?.length && a1?.every((el, idx) => a2?.[idx] === el));
}

export function parseTimeToSeconds(timeString: string): number {
  const match = /^([0-9]+)(s|m|h|d)?$/.exec(timeString.toLowerCase());
  if (!match) {
    throw new Error(`Cannot parse "${timeString}" as time.`);
  }

  const [, time, unit] = match;
  return +time * (unit === 'd' ? 24 * 60 * 60 : unit === 'h' ? 60 * 60 : unit === 'm' ? 60 : 1);
}
