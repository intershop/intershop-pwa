import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ContentfulComponent } from '../models/contentfulComponent.model';
import { ContentfulService } from '../services/contentful.service';

@Injectable({ providedIn: 'root' })
export class ContentfulFacade {
  constructor(private contentfulService: ContentfulService) {}

  //Get content from Contentful by content type id
  getContent(contentType: string): Observable<ContentfulComponent[]> {
    return this.contentfulService.getContent(contentType);
  }
}
