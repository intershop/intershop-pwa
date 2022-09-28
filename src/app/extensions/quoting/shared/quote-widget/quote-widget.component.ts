import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, combineLatest, iif, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { QuotingFacade } from '../../facades/quoting.facade';

@Component({
  selector: 'ish-quote-widget',
  templateUrl: './quote-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class QuoteWidgetComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;

  respondedQuotes: number;
  submittedQuoteRequests: number;

  private destroy$ = new Subject<void>();

  constructor(private quotingFacade: QuotingFacade, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loading$ = this.quotingFacade.loading$;

    const quotingStates$ = this.quotingFacade
      .quotingEntities$()
      .pipe(
        switchMap(quotes =>
          iif(() => !quotes?.length, of([]), combineLatest(quotes.map(quote => this.quotingFacade.state$(quote.id))))
        )
      );

    combineLatest([
      quotingStates$.pipe(
        map(states => states.filter(state => state === 'Responded').length),
        distinctUntilChanged()
      ),
      quotingStates$.pipe(
        map(states => states.filter(state => state === 'Submitted').length),
        distinctUntilChanged()
      ),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([responded, submitted]) => {
        this.respondedQuotes = responded;
        this.submittedQuoteRequests = submitted;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
