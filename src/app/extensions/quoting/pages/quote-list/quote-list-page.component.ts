import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { QuotingFacade } from '../../facades/quoting.facade';
import { Quote, QuoteRequest } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-list-page',
  templateUrl: './quote-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteListPageComponent implements OnInit {
  loading$: Observable<boolean>;
  quotes: (Quote | QuoteRequest)[];

  private destroyRef = inject(DestroyRef);

  constructor(private quotingFacade: QuotingFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.quotingFacade
      .quotingEntities$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(quotes => {
        this.quotes = quotes;
        this.cd.detectChanges();
      });
    this.loading$ = this.quotingFacade.loading$;
  }
}
