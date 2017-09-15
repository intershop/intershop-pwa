import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { CustomErrorHandler } from './custom-error-handler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { CacheCustomService } from './cache/cache-custom.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class MockApiService {
  mockDataRootPath = '/assets/mock-data';
  configSettings: any;
  constructor(private httpClient: HttpClient,
    private customErrorHandler: CustomErrorHandler,
    private cacheCustomService: CacheCustomService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.getConfig();
    }
  }

  /**
   * @param  {string} path
   * @param  {HttpHeaders} headers
   * @param  {string} apiUrl
   * @returns Observable
   */
  get(path: string, headers: HttpHeaders, apiUrl: string): Observable<any> {
    if (this.isExcluded(path)) {
      // get data from api server if path is excluded
      return this.httpClient.get(apiUrl, { headers: headers })
        .catch(this.formatErrors.bind(this));
    }

    const mockDataUrl = `${this.mockDataRootPath}/${this.ParsePath(path)}/get-data.json`;

    // this code block get executed when there is no
    return this.httpClient.get(mockDataUrl, { headers: headers }).map(data => {
      return data;
    }).catch((error: any) => {
      // if mock data not available get from api server
      if (error instanceof HttpErrorResponse && error.status === 404) {
        return this.httpClient.get(apiUrl, { headers: headers })
          .catch(this.formatErrors.bind(this));
      }
    });
  }

  private ParsePath(path: string): string {
    return path.split('?')[0];
  }

  private formatErrors(error: any) {
    return this.customErrorHandler.handleApiErrors(error);
  }

  private getConfig() {
    const mockConfigDataKey = 'mockConfigData';
    if (this.cacheCustomService.cacheKeyExists(mockConfigDataKey)) {
      this.configSettings = this.cacheCustomService.getCachedData(mockConfigDataKey);
      return;
    }

    const configJason = `${this.mockDataRootPath}/config.json`;
    this.httpClient.get(configJason).subscribe(data => {
      this.configSettings = data;
      this.cacheCustomService.storeDataToCache(data, mockConfigDataKey);
    });
  }

  private isExcluded(path: string) {
    if (!this.configSettings) {
      return;
    }

    if (this.configSettings.mockAllRequest) {
      return this.matchPath(path, this.configSettings.exlcudePath);
    } else {
      return !this.matchPath(path, this.configSettings.includePath);
    }
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
