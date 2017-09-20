import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../index';

@Injectable()
export class SearchBoxService {
    url = 'suggest?SearchTerm=';

    /**
     * @param  {ApiService} privateapiService
     */
    constructor(private apiService: ApiService) { }

    /**
     * Returns the list of items matching the search term
     * @param  {} terms
     */
    public search(terms) {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap((value) => {
                return value.length === 0 ?
                    Observable.of([]) :
                    this.searchEntries(value);
            });
    }

    /**
     * Calls the get method of api
     * @param  {} value
     */
    public searchEntries(value) {
        return this.apiService.get(this.url + value);
    }
}
