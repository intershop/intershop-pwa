import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { CallParameters } from 'ish-core/models/call-parameters/call-parameters.model';
import { ContentPageletEntryPointData } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.interface';
import { ContentPageletEntryPointMapper } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.mapper';
import { ContentPageletEntryPoint } from 'ish-core/models/content-pagelet-entry-point/content-pagelet-entry-point.model';
import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { SeoAttributesMapper } from 'ish-core/models/seo-attributes/seo-attributes.mapper';
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

    return this.apiService
      .get<ContentPageletEntryPointData>(`cms/includes/${includeId}`, { sendPGID: true })
      .pipe(
        map(x => this.contentPageletEntryPointMapper.fromData(x)),
        map(([include, pagelets]) => ({ include, pagelets }))
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

    return this.apiService
      .get<ContentPageletEntryPointData>(`cms/pages/${pageId}`, { sendPGID: true })
      .pipe(
        map(x => this.contentPageletEntryPointMapper.fromData(x)),
        map(([page, pagelets]) => this.mapSeoAttributes(page, pagelets)),
        map(([page, pagelets]) => ({ page, pagelets }))
      );
  }

  private mapSeoAttributes(
    page: ContentPageletEntryPoint,
    pagelets: ContentPagelet[]
  ): [ContentPageletEntryPoint, ContentPagelet[]] {
    return [{ ...page, seoAttributes: SeoAttributesMapper.fromCMSData(pagelets.length && pagelets[0]) }, pagelets];
  }

  /**
   * Get the content for the given View Context with the given context (e.g. Product or Category).
   * @param viewContextId  The view context ID.
   * @param callParameters The call parameters to give the current context.
   * @returns              The view contexts entrypoint content data.
   */
  getViewContextContent(
    viewContextId: string,
    callParameters: CallParameters
  ): Observable<{ entrypoint: ContentPageletEntryPoint; pagelets: ContentPagelet[] }> {
    if (!viewContextId) {
      return throwError('getViewContextContent() called without a viewContextId');
    }

    let params = new HttpParams();
    if (callParameters) {
      params = Object.entries(callParameters).reduce((param, [key, value]) => param.set(key, value), new HttpParams());
    }

    return this.apiService
      .get<ContentPageletEntryPointData>(`cms/viewcontexts/${viewContextId}/entrypoint`, {
        sendPGID: true,
        params,
        skipApiErrorHandling: true,
      })
      .pipe(
        map(entrypoint => this.contentPageletEntryPointMapper.fromData(entrypoint)),
        map(([entrypoint, pagelets]) => ({ entrypoint, pagelets }))
      );
  }
}
