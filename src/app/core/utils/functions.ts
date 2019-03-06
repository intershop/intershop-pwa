import { range } from 'lodash-es';

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

export const groupBy = (objectArray, keySelector) =>
  objectArray.reduce((acc, obj) => {
    const key = keySelector(obj);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});

/**
 * Convert object to array containing objects with key and value
 * @param values  The object
 * @returns       The converted array
 */
export const objectToArray = (values: { [key: string]: string }) =>
  Object.keys(values).map(key => ({ key, value: values[key] }));
