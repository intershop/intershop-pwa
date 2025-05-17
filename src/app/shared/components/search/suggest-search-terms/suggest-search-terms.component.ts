import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, ReplaySubject, map } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PipesModule } from 'ish-core/pipes.module';

@Component({
  selector: 'ish-suggest-search-terms',
  templateUrl: './suggest-search-terms.component.html',
  standalone: true,
  imports: [CommonModule, PipesModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestSearchTermsComponent implements OnInit {
  @Input() maxRecentlySearchedWords: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() submitSearch = new EventEmitter<string>();

  searchTerms$: Observable<string[]>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.searchTerms$ = this.shoppingFacade.recentSearchTerms$.pipe(
      map(terms => terms.slice(0, this.maxRecentlySearchedWords))
    );
  }

  submit(term: string) {
    this.submitSearch.emit(term);
  }
}
