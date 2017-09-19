import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { CustomErrorHandler } from './custom-error-handler';

@Injectable()
export class MockApiService {
  mockDataRootPath = '/assets/mock-data';
  configSettings: any;
  constructor(private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private customErrorHandler: CustomErrorHandler,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.getConfig();
    }
  }

  public getMockPath(path: string): string {
    return `${this.mockDataRootPath}/${this.removeQueryStringParameter(path)}/get-data.json`;
  }

  public pathHasToBeMocked(path: string) {
    if (!this.configSettings) {
      return true;
    }

    if (this.configSettings.mockAllRequest) {
      return !this.matchPath(path, this.configSettings.exlcudePath);
    } else {
      return this.matchPath(path, this.configSettings.includePath);
    }
  }

  private removeQueryStringParameter(path: string): string {
    return path.split('?')[0];
  }

  private getConfig() {
    const configJason = `${this.mockDataRootPath}/config.json`;
    this.httpClient.get(configJason).subscribe(data => {
      this.configSettings = data;
    }, (err) => {
      return this.customErrorHandler.handleApiErrors(err);
    });
  }

  private matchPath(requestedPath: string, pathArray: any) {
    for (const configPath of pathArray) {
      if (requestedPath.endsWith(configPath)) {
        return true;
      }
    }
    return false;
  }
}
