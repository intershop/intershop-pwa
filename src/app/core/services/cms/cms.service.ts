import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentPageMapper } from 'ish-core/models/content-page/content-page.mapper';
import { ContentPage } from 'ish-core/models/content-page/content-page.model';
import { ContentIncludeData } from '../../models/content-include/content-include.interface';
import { ContentIncludeMapper } from '../../models/content-include/content-include.mapper';
import { ContentInclude } from '../../models/content-include/content-include.model';
import { ContentPagelet } from '../../models/content-pagelet/content-pagelet.model';
import { ApiService } from '../api/api.service';

/**
 * The Content Includes Service handles the interaction with the Content Include API.
 */
@Injectable({ providedIn: 'root' })
export class CMSService {
  constructor(
    private apiService: ApiService,
    private contentIncludeMapper: ContentIncludeMapper,
    private contentPageMapper: ContentPageMapper
  ) {}

  /**
   * Get the content for the given Content Include ID.
   * @param includeId The include ID.
   * @returns         The Content data.
   */
  getContentInclude(includeId: string): Observable<{ include: ContentInclude; pagelets: ContentPagelet[] }> {
    if (!includeId) {
      return throwError('getContent() called without an includeId');
    }

    return this.apiService
      .get<ContentIncludeData>(`cms/includes/${includeId}`)
      .pipe(map(x => this.contentIncludeMapper.fromData(x)));
  }

  getContentPage(pageId: string): Observable<{ page: ContentPage; pagelets: ContentPagelet[] }> {
    if (!pageId) {
      return throwError('getContent() called without an pageId');
    }

    return (
      this.apiService
        // change to correct rest patch
        .get<ContentIncludeData>(`cms/includes/${pageId}`)
        .pipe(map(x => this.contentPageMapper.fromData(x)))
    );
  }
}
