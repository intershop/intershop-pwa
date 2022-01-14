import { ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';

/**
 * Structural directive.
 * Used on an element, this element will only be rendered if the specified feature *is not enabled*.
 *
 * For the negated case see {@link FeatureToggleDirective}.
 *
 * @example
 * <div *ishNotFeature="'quoting'">
 *   Only visible when quoting is NOT enabled by configuration.
 * </div>
 */
@Directive({
  selector: '[ishNotFeature]',
})
export class NotFeatureToggleDirective implements OnDestroy {
  private subscription: Subscription;
  private disabled$ = new ReplaySubject<boolean>(1);

  private destroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private featureToggle: FeatureToggleService,
    private cdRef: ChangeDetectorRef
  ) {
    this.disabled$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(disabled => {
      if (disabled) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
      this.cdRef.markForCheck();
    });
  }

  @Input() set ishNotFeature(val: string) {
    // end previous subscription and newly subscribe
    if (this.subscription) {
      // eslint-disable-next-line ban/ban
      this.subscription.unsubscribe();
    }

    this.subscription = this.featureToggle
      .enabled$(val)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: value => this.disabled$.next(!value) });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
