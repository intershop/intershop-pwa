import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api/api.service';
import { ContentIncludeData } from '../../../models/content-include/content-include.interface';
import { ContentIncludeMapper } from '../../../models/content-include/content-include.mapper';
import { ContentInclude } from '../../../models/content-include/content-include.model';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';

/**
 * The Content Includes Service handles the interaction with the Content Include API.
 */
@Injectable({ providedIn: 'root' })
export class ContentIncludesService {
  constructor(private apiService: ApiService) {}

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
      .pipe(map(ContentIncludeMapper.fromData));
  }
}
