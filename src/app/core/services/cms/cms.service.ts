import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentEntryPointData } from 'ish-core/models/content-entry-point/content-entry-point.interface';
import { ContentEntryPointMapper } from 'ish-core/models/content-entry-point/content-entry-point.mapper';
import { ContentEntryPoint } from 'ish-core/models/content-entry-point/content-entry-point.model';
import { ContentPagelet } from '../../models/content-pagelet/content-pagelet.model';
import { ApiService } from '../api/api.service';

/**
 * The CMS Service handles the interaction with the CMS API.
 */
@Injectable({ providedIn: 'root' })
export class CMSService {
  constructor(private apiService: ApiService, private contentEntryPointMapper: ContentEntryPointMapper) {}

  /**
   * Get the content for the given Content Include ID.
   * @param includeId The include ID.
   * @returns         The content data.
   */
  getContentInclude(includeId: string): Observable<{ include: ContentEntryPoint; pagelets: ContentPagelet[] }> {
    if (!includeId) {
      return throwError('getContentInclude() called without an includeId');
    }

    return this.apiService.get<ContentEntryPointData>(`cms/includes/${includeId}`).pipe(
      map(x => this.contentEntryPointMapper.fromData(x)),
      map(({ contentEntryPoint, pagelets }) => ({ include: contentEntryPoint, pagelets }))
    );
  }

  /**
   * Get the content for the given Content Page ID.
   * @param includeId The page ID.
   * @returns         The content data.
   */
  getContentPage(pageId: string): Observable<{ page: ContentEntryPoint; pagelets: ContentPagelet[] }> {
    if (!pageId) {
      return throwError('getContentPage() called without an pageId');
    }

    return this.apiService.get<ContentEntryPointData>(`cms/pages/${pageId}`).pipe(
      map(x => this.contentEntryPointMapper.fromData(x)),
      map(({ contentEntryPoint, pagelets }) => ({ page: contentEntryPoint, pagelets }))
    );
  }
}
