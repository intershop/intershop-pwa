import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SparqueApiService } from 'src/app/extensions/sparque/services/sparque-api/sparque-api.service';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

/**
 * The Suggest Service handles the interaction with the 'suggest' REST API.
 */

@Injectable({ providedIn: 'root' })
export class SuggestService {
  constructor(private sparqueApiService: SparqueApiService) {}

  /**
   * Returns a list of suggested search terms matching the given search term.
   *
   * @param searchTerm  The search term to get suggestions for.
   * @returns           List of suggested search terms.
   */
  search(searchTerm: string): Observable<SuggestTerm[]> {
    return this.sparqueApiService
      .get(`e/keywordsuggest/p/keyword/${searchTerm}/results`)
      .pipe(map((object: any) => object.items.map((item: any) => ({ term: item.tuple[0] }))));
  }
}
