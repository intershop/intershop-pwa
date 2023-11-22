import { HttpParams } from '@angular/common/http';



export class URLFormParams {
  private data = new Map<string, string[]>();

  constructor(fromURI?: string) {
    if (fromURI) {
      fromURI.split('&')
        .filter(val => val?.includes('='))
        .forEach(val => {
          const [key, values] = val.split('=');
          this.data.set(decodeURIComponent(key), values.split(',').map(decodeURIComponent));
        })
    }
  }

  getSingle(key: string): string {
    return this.data.get(key)?.[0];
  }

  getMulti(key: string): string[] {
    return this.data.get(key) || [];
  }

  entries(): IterableIterator<[string, string[]]> {
    return this.data.entries();
  }

  setSingle(key: string, value: string): void {
    this.data.set(key, [value]);
  }

  setMulti(key: string, value: string[]): void {
    this.data.set(key, value);
  }

  delete(key: string): void {
    this.data.delete(key);
  }

  toURI(): string {
    const parts = [];
    for (const [key, values] of this.data) {
      if (!values?.length) continue;
      parts.push(`${encodeURIComponent(key)}=${values.map(encodeURIComponent).join(',')}`);
    }
    return parts.join('&');
  }

  appendToHttpParams(params: HttpParams = new HttpParams()): HttpParams {
    for (const [key, values] of this.data) {
      if (!values?.length) continue;
      params = params.set(key, values.join(','));
    }
    
    return params;
  }

  serialize(): Record<string, string[]> {
    const serialized: Record<string, string[]> = {};
    for (const [key, values] of this.data) {
      if (!values?.length) continue;
      serialized[key] = values;
    }
    return serialized;
  }
}
