import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { searchBoxMock } from '../search-box-mock';
import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../shared/services/api.service';

@Injectable()
export class SearchBoxApiService {

    constructor(private apiService: ApiService) {

    }

    public search(terms) {
        return terms.debounceTime(400)
            .distinctUntilChanged()
            .switchMap((value) => {
                return value.length === 0 ?
                    Observable.of([]) :
                    this.searchEntries(value);
            });
    };

    public searchEntries(value) {
        return this.apiService.get('suggest?SearchTerm=' + value)
    }
};
