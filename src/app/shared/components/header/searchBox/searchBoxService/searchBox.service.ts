import {Observable} from 'rxjs/Observable';
import * as _ from 'lodash';
import {searchBoxMock} from '../searchBoxMock';

export class SearchBoxService {
  public static search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap((value) => {
        return value.length === 0 ?
          Observable.of([]) :
          this.searchEntries(value);
      });
  }

  public static searchEntries(value) {
    const filterList = _.filter(searchBoxMock.elements, (obj) => {
      return obj.term.indexOf(value) !== -1;
    });
    return Observable.of(filterList);
  }
}
