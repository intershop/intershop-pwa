import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

/**
 * The Suggest Service handles the interaction with the 'suggest' REST API.
 */
@Injectable({ providedIn: 'root' })
export class SuggestService {
  constructor(private apiService: ApiService) {}

  /**
   * Returns a list of suggested search terms matching the given search term.
   * @param searchTerm  The search term to get suggestions for.
   * @returns           List of suggested search terms.
   */
  search(searchTerm: string): Observable<SuggestTerm[]> {
    const params = new HttpParams().set('SearchTerm', searchTerm);
    return this.apiService.get('suggest', { params }).pipe(unpackEnvelope<SuggestTerm>());
  }
}
