import { ChangeDetectorRef, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { FeatureToggleService, FeatureToggleType } from 'ish-core/feature-toggle.module';

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
  standalone: true,
})
export class NotFeatureToggleDirective {
  private feature$ = new BehaviorSubject<'always' | 'never' | FeatureToggleType>(undefined);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private featureToggle: FeatureToggleService,
    private cdRef: ChangeDetectorRef
  ) {
    this.feature$
      .pipe(
        switchMap(val => (val ? this.featureToggle.enabled$(val) : of(false))),
        map(value => !value),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(disabled => {
        if (disabled) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
        this.cdRef.markForCheck();
      });
  }

  @Input() set ishNotFeature(val: 'always' | 'never' | FeatureToggleType) {
    this.feature$.next(val);
  }
}
