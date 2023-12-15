// Example homepage made by Fenego NV (https://www.fenego.be/)

import { Injectable, inject } from '@angular/core';
import { createClient } from 'contentful';
import { ContentfulClientApi } from 'contentful/dist/types';
import { Observable, from, map, switchMap } from 'rxjs';

import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { ContentfulComponent } from '../models/contentfulComponent.model';
import { ContentfulConfig } from '../models/contentfulConfig.model';

@Injectable({ providedIn: 'root' })
export class ContentfulService {
  private statePropertiesService = inject(StatePropertiesService);
  private cdaClient: ContentfulClientApi<undefined>;

  private getClient() {
    return this.statePropertiesService.getStateOrEnvOrDefault<ContentfulConfig>('CONTENTFUL', 'contentful').pipe(
      whenTruthy(),
      map(config => {
        if (this.cdaClient === undefined) {
          this.cdaClient = createClient({
            space: config.spaceId,
            accessToken: config.accessToken,
          });
        }
        return this.cdaClient;
      })
    );
  }

  getContent(contentType: string): Observable<ContentfulComponent[]> {
    return this.getClient().pipe(
      switchMap(client =>
        from(
          client
            .getEntries({
              content_type: contentType,
            })
            .then(res => res.items)
        )
      )
    );
  }
}
