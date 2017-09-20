import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class MockApiService {
  mockDataRootPath = '/assets/mock-data';

  public getMockPath(path: string): string {
    return `${this.mockDataRootPath}/${this.removeQueryStringParameter(path)}/get-data.json`;
  }

  public pathHasToBeMocked(path: string) {
    return environment.needMock || this.matchPath(path, environment['mustMockPaths']);
  }

  private removeQueryStringParameter(path: string): string {
    return path.split('?')[0];
  }

  public matchPath(requestedPath: string, pathArray: string[]) {
    for (const configPath of pathArray) {
      if (new RegExp('^' + configPath + '$').test(requestedPath)) {
        return true;
      }
    }
    return false;
  }
}
