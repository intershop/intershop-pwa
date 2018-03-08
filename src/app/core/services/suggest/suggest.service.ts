// NEEDS_WORK: review and understand (search-box results in javascript error when used in french, could be problem of service or component)
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, toArray } from 'rxjs/operators';
import { SuggestTerm } from '../../../models/suggest-term/suggest-term.model';
import { ApiService } from '../api.service';

@Injectable()
export class SuggestService {

  private serviceIdentifier = 'suggest';

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * Returns the list of items matching the search term
   * @param searchTerm$  The search term to get suggestions for.
   * @returns           List of suggested search terms.
   */
  public search(searchTerm$: Observable<string>): Observable<SuggestTerm[]> {
    return searchTerm$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      filter((searchTerm) => searchTerm.length > 0),
      map(searchTerm => new HttpParams().set('SearchTerm', searchTerm)),
      switchMap(params => this.apiService.get<SuggestTerm>(this.serviceIdentifier, params, null, true, false)),
      toArray()
    );
  }

}
