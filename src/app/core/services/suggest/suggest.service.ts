import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';
import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';
import { SparqueApiService } from 'src/app/extensions/sparque/services/sparque-api/sparque-api.service';
/**
 * The Suggest Service handles the interaction with the 'suggest' REST API.
 */
@Injectable({ providedIn: 'root' })
export class SuggestService {
  constructor(
    private apiService: ApiService, 
    private featureToggle: FeatureToggleService, 
    private sparqueApiService: SparqueApiService
    ) {}

  /**
   * Returns a list of suggested search terms matching the given search term.
   *
   * @param searchTerm  The search term to get suggestions for.
   * @returns           List of suggested search terms.
   */
  search(searchTerm: string): Observable<SuggestTerm[]> {
    if(this.featureToggle.enabled('sparque'))
    {
      return this.sparqueApiService
        .get(`e/keywordsuggest/p/keyword/${searchTerm}/results`)
        .pipe(map((object: any) => object.items.map((item: any) => ({ term: item.tuple[0] }))));
    }
    else
    {
      const params = new HttpParams().set('SearchTerm', searchTerm);
      return this.apiService.get('suggest', { params }).pipe(unpackEnvelope<SuggestTerm>());
    }
  }
}
