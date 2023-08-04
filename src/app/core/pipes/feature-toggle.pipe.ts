import { ChangeDetectorRef, DestroyRef, Pipe, PipeTransform, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

import { FeatureToggleService } from 'ish-core/utils/feature-toggle/feature-toggle.service';

/**
 * Pipe
 *
 * Used on a string, this pipe will only return true if the specified feature *is enabled*.
 * For the corresponding directive, see {@link FeatureToggleDirective}.
 *
 * @example
 * <ish-product-add-to-compare *ngIf="'compare' | ishFeature"> ...</ish-product-add-to-compare>
 */
@Pipe({ name: 'ishFeature', pure: false })
export class FeatureTogglePipe implements PipeTransform {
  private enabled: boolean;
  private destroyRef = inject(DestroyRef);
  private subscription: Subscription;

  constructor(private featureToggleService: FeatureToggleService, private cdRef: ChangeDetectorRef) {}

  transform(feature: string): boolean {
    if (this.subscription) {
      // eslint-disable-next-line ban/ban
      this.subscription.unsubscribe();
    }

    this.subscription = this.featureToggleService
      .enabled$(feature)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(val => {
        this.enabled = val;
        this.cdRef.markForCheck();
      });

    return this.enabled;
  }
}
