import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { QuotingFacade } from '../../facades/quoting.facade';
import { Quote, QuoteRequest } from '../../models/quoting/quoting.model';

@Component({
  selector: 'ish-quote-list-page',
  templateUrl: './quote-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteListPageComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  quotes: (Quote | QuoteRequest)[];

  private destroy$ = new Subject<void>();

  constructor(private quotingFacade: QuotingFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.quotingFacade
      .quotingEntities$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(quotes => {
        this.quotes = quotes;
        this.cd.detectChanges();
      });
    this.loading$ = this.quotingFacade.loading$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
