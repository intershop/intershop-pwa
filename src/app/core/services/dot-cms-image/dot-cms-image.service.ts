import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { DotCmsImageData } from 'ish-core/models/dot-cms-image/dot-cms-image.interface';
import { DotCmsImageMapper } from 'ish-core/models/dot-cms-image/dot-cms-image.mapper';
import { DotCmsImage } from 'ish-core/models/dot-cms-image/dot-cms-image.model';

@Injectable({ providedIn: 'root' })
export class DotCmsImageService {
  private apiUrl =
    'https://local.dotcms.site:8443/api/content/render/false/query/+contentType:dotAsset%20+(conhost:48190c8c-42c4-46af-8d1a-0cd5db894797%20conhost:SYSTEM_HOST)%20+languageId:1%20+deleted:false%20+working:true%20+variant:default/orderby/modDate%20desc';

  constructor(private imageMapper: DotCmsImageMapper, private http: HttpClient) {}

  getDotCmsImage(): Observable<DotCmsImage[]> {
    return this.http
      .get<{ contentlets: DotCmsImageData[] }>(`${this.apiUrl}/api/images`)
      .pipe(map(response => response.contentlets.map(image => this.imageMapper.fromData(image))));
  }
}
