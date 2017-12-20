// NEEDS_WORK: review and understand (search-box results in javascript error when used in french, could be problem of service or component)
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Observable } from 'rxjs/Observable';
import { SuggestTerm } from '../../../models/suggest-term.model';
import { ApiService } from '../api.service';


@Injectable()
export class SuggestService {

  private serviceIdentifier = 'suggest';

  constructor(
    private apiService: ApiService
  ) { }

  /**
   * Returns the list of items matching the search term
   * @param searchTerm  The search term to get suggestions for.
   * @returns           List of suggested search terms.
   */
  public search(searchTerm: Observable<string>): Observable<SuggestTerm[]> {
    return searchTerm.debounceTime(400)
      .distinctUntilChanged()
      .switchMap((value) => {
        if (value.length === 0) {
          return Observable.of([]);
        } else {
          const params = new HttpParams().set('SearchTerm', value);
          return this.apiService.get(this.serviceIdentifier, params, null, true, false);
        }
      });
  }
}
