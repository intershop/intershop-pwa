import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentPageletEntryPointData } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.interface';
import { ContentPageletEntryPointMapper } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.mapper';
import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { ApiService } from 'ish-core/services/api/api.service';

/**
 * The CMS Service handles the interaction with the CMS API.
 */
@Injectable({ providedIn: 'root' })
export class CMSService {
  constructor(private apiService: ApiService, private contentPageletEntryPointMapper: ContentPageletEntryPointMapper) {}

  /**
   * Get the content for the given Content Include ID.
   * @param includeId The include ID.
   * @returns         The content data.
   */
  getContentInclude(includeId: string): Observable<{ include: ContentPageletEntryPoint; pagelets: ContentPagelet[] }> {
    if (!includeId) {
      return throwError('getContentInclude() called without an includeId');
    }

    return this.apiService.get<ContentPageletEntryPointData>(`cms/includes/${includeId}`).pipe(
      map(x => this.contentPageletEntryPointMapper.fromData(x)),
      map(({ pageletEntryPoint, pagelets }) => ({ include: pageletEntryPoint, pagelets }))
    );
  }

  /**
   * Get the content for the given Content Page ID.
   * @param includeId The page ID.
   * @returns         The content data.
   */
  getContentPage(pageId: string): Observable<{ page: ContentPageletEntryPoint; pagelets: ContentPagelet[] }> {
    if (!pageId) {
      return throwError('getContentPage() called without an pageId');
    }

    return this.apiService.get<ContentPageletEntryPointData>(`cms/pages/${pageId}`).pipe(
      map(x => this.contentPageletEntryPointMapper.fromData(x)),
      map(({ pageletEntryPoint, pagelets }) => ({ page: pageletEntryPoint, pagelets }))
    );
  }
}
