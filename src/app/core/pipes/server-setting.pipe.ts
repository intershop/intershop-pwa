import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'serverSetting', pure: true })
export class ServerSettingPipe implements PipeTransform {
  transform(value: boolean): string {
    return 'test: ' + (value ? 'okay' : 'failed');
  }
}
