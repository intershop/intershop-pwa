import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sanitize', pure: true })
export class SanitizePipe implements PipeTransform {
  transform(value: string): string {
    return value !== undefined
      ? value
          .replace(/[^a-zA-Z0-9-]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_+/g, '')
          .replace(/_+$/g, '')
      : 'undefined';
  }
}
