// NEEDS_WORK: review and understand (search-box results in javascript error when used in french, could be problem of service or component)
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, concatMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
      concatMap(searchTerm => {
        if (searchTerm && searchTerm.length > 0) {
          const params = new HttpParams().set('SearchTerm', searchTerm);
          return this.apiService.get<SuggestTerm[]>(this.serviceIdentifier, params, null, true, false);
        } else {
          return of([]);
        }
      }),
      catchError(() => of([])),
    );
  }
}
