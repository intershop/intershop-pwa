import { HttpParams } from '@angular/common/http';

export interface URLFormParams {
  [facet: string]: string[] | string;
}

function concat(val: string[] | string, separator: string): string {
  return Array.isArray(val) ? val.join(separator) : val;
}

function encodeAndConcat(val: string[] | string, separator: string): string {
  return Array.isArray(val) ? val.map(encodeURIComponent).join(separator) : encodeURIComponent(val);
}

export function formParamsToString(object: URLFormParams, separator = ','): string {
  return object
    ? Object.entries(object)
        .filter(([, value]) => (Array.isArray(value) || typeof value === 'string') && value.length)
        .map(([key, val]) => `${key}=${encodeAndConcat(val, separator)}`)
        .join('&')
    : '';
}

export function appendFormParamsToHttpParams(
  object: URLFormParams,
  params: HttpParams = new HttpParams(),
  separator = ','
): HttpParams {
  return object
    ? Object.entries(object)
        .filter(([, value]) => (Array.isArray(value) || typeof value === 'string') && value.length)
        .reduce((p, [key, val]) => p.set(key, concat(val, separator)), params)
    : params;
}

function splitAndDecode(val: string, separator: string): string[] | string {
  return val.includes(separator) ? val.split(separator).map(decodeURIComponent) : decodeURIComponent(val);
}

export function stringToFormParams(object: string, separator = ','): URLFormParams {
  return object
    ? object
        .split('&')
        .filter(val => val?.includes('='))
        .map(val => {
          const [key, values] = val.split('=');
          return { key: decodeURIComponent(key), value: splitAndDecode(values, separator) };
        })
        .reduce((acc, val) => ({ ...acc, [val.key]: val.value }), {})
    : {};
}
