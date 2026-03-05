import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { QuotingFacade } from '../../facades/quoting.facade';
import { Quote, QuoteRequest } from '../../models/quoting/quoting.model';

import { QuoteListComponent } from './quote-list/quote-list.component';

@Component({
  selector: 'ish-quote-list-page',
  templateUrl: './quote-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, LoadingComponent, NgIf, QuoteListComponent, TranslatePipe],
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
