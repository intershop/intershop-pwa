import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * The Content Page Container Component prepares all data required to display content managed pages.
 * uses {@link ContentPageComponent} to display content managed pages
 */
@Component({
  templateUrl: './content-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ContentPageContainerComponent implements OnInit, OnDestroy {
  contentPageId: string;
  destroy$ = new Subject();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.contentPageId = params.contentPageId;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
