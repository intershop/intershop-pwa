import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SuggestTerm } from '../../../../models/suggest-term/suggest-term.model';
import { SuggestService } from '../../../services/suggest/suggest.service';

@Component({
  selector: 'ish-search-box-container',
  templateUrl: './search-box.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxContainerComponent implements OnInit {

  searchResults$: Observable<SuggestTerm[]>;

  private searchTerm$ = new Subject<string>();

  constructor(
    private suggestService: SuggestService
  ) { }

  ngOnInit() {
    this.searchResults$ = this.suggestService.search(this.searchTerm$);
  }

  search(term: string) {
    this.searchTerm$.next(term);
  }
}
