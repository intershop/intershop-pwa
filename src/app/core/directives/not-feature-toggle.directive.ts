import { ChangeDetectorRef, DestroyRef, Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReplaySubject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

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
export class NotFeatureToggleDirective {
  private subscription: Subscription;
  private disabled$ = new ReplaySubject<boolean>(1);

  private destroyRef = inject(DestroyRef);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private featureToggle: FeatureToggleService,
    private cdRef: ChangeDetectorRef
  ) {
    this.disabled$.pipe(distinctUntilChanged(), takeUntilDestroyed()).subscribe(disabled => {
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: value => this.disabled$.next(!value) });
  }
}
