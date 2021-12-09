import { ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';

/**
 * Structural directive.
 * Used on an element, this element will only be rendered if the specified feature *is enabled*.
 *
 * For the negated case see {@link NotFeatureToggleDirective}.
 * For the corresponding pipe see {@link FeatureTogglePipe}.
 *
 * @example
 * <div *ishFeature="'quoting'">
 *   Only visible when quoting is enabled by configuration.
 * </div>
 */
@Directive({
  selector: '[ishFeature]',
})
export class FeatureToggleDirective implements OnDestroy {
  private otherTemplateRef: TemplateRef<unknown>;

  private subscription: Subscription;
  private enabled$ = new ReplaySubject<boolean>(1);

  private destroy$ = new Subject();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private featureToggle: FeatureToggleService,
    private cdRef: ChangeDetectorRef
  ) {
    this.viewContainer.clear();
    this.enabled$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(enabled => {
      if (enabled) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (this.otherTemplateRef) {
        this.viewContainer.createEmbeddedView(this.otherTemplateRef);
      }
      this.cdRef.markForCheck();
    });
  }

  @Input() set ishFeature(feature: string) {
    // end previous subscription and newly subscribe
    if (this.subscription) {
      // tslint:disable-next-line: ban
      this.subscription.unsubscribe();
    }

    this.subscription = this.featureToggle
      .enabled(feature)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: val => this.enabled$.next(val) });
  }

  @Input() set ishFeatureElse(otherTemplateRef: TemplateRef<unknown>) {
    // end previous subscription and newly subscribe
    if (this.subscription) {
      // tslint:disable-next-line: ban
      this.subscription.unsubscribe();
    }

    this.otherTemplateRef = otherTemplateRef;
    this.subscription = this.featureToggle
      .enabled('')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.enabled$.next(true));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
