export interface URLFormParams {
  [facet: string]: string[];
}

export function formParamsToString(object: URLFormParams, separator = ','): string {
  return object
    ? Object.entries(object)
        .filter(([, value]) => Array.isArray(value) && value.length)
        .map(([key, val]) => `${key}=${(val as string[]).join(separator)}`)
        .join('&')
    : '';
}

export function stringToFormParams(object: string, separator = ','): URLFormParams {
  return object
    ? object
        .split('&')
        .filter(val => val && val.includes('='))
        .map(val => {
          const [key, values] = val.split('=');
          return { key, value: values.split(separator) };
        })
        .reduce((acc, val) => ({ ...acc, [val.key]: val.value }), {})
    : {};
}
