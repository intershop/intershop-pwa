// NEEDS_WORK: review and understand (search-box results in javascript error when used in french, could be problem of service or component)
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../../core/services/api.service';
import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';

@Injectable()
export class SuggestService {
  private serviceIdentifier = 'suggest';

  constructor(private apiService: ApiService) {}

  /**
   * Returns the list of items matching the search term
   * @param searchTerm  The search term to get suggestions for.
   * @returns           List of suggested search terms.
   */
  search(searchTerm: string): Observable<SuggestTerm[]> {
    const params = new HttpParams().set('SearchTerm', searchTerm);
    return this.apiService.get<SuggestTerm[]>(this.serviceIdentifier, params, null, true, false);
  }
}
