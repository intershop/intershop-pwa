import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { searchBoxMock } from '../search-box-mock';
import { Injectable } from '@angular/core';

@Injectable()
export class SearchBoxMockService {
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
    const filterList = {
      'elements' : []
    }
    filterList.elements = _.filter(searchBoxMock.elements, (obj) => {
      return obj.term.indexOf(value) !== -1;
    });
    return Observable.of(filterList);
  }
};
