import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PipesModule } from 'ish-core/pipes.module';

@Component({
  selector: 'ish-suggest-search-terms-tile',
  templateUrl: './suggest-search-terms-tile.component.html',
  standalone: true,
  imports: [CommonModule, PipesModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestSearchTermsTileComponent {
  @Input() maxRecentlySearchedWords: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() submitSearch = new EventEmitter<string>();

  private destroyRef = inject(DestroyRef);
  keywords: string[];

  constructor(shoppingFacade: ShoppingFacade) {
    shoppingFacade.recentlySearchTerms$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(terms => {
      this.keywords = terms;
    });
  }

  submit(term: string) {
    this.submitSearch.emit(term);
  }
}
