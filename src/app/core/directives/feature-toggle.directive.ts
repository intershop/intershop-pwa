import { ChangeDetectorRef, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

import { FeatureToggleService, FeatureToggleType } from 'ish-core/feature-toggle.module';

/**
 * Structural directive.
 * Used on an element, this element will only be rendered if the specified feature *is enabled*.
 *
 * For the negated case see {@link NotFeatureToggleDirective}.
 * For the corresponding pipe see {@link FeatureTogglePipe}.
 *
 * @example
 * <div *ishFeature="'quoting'; else disabledTemplate">
 *   Only visible when quoting is enabled.
 * </div>
 * <ng-template #disabledTemplate>
 *   <div>Quoting is disabled.</div>
 * </ng-template>
 */
@Directive({
  selector: '[ishFeature]',
  standalone: false,
})
export class FeatureToggleDirective {
  private otherTemplateRef: TemplateRef<unknown>;
  private feature$ = new BehaviorSubject<'always' | 'never' | FeatureToggleType>(undefined);
  private elseSet$ = new BehaviorSubject<boolean>(false);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private featureToggle: FeatureToggleService,
    private cdRef: ChangeDetectorRef
  ) {
    combineLatest([
      this.feature$.pipe(
        switchMap(feature => (feature ? this.featureToggle.enabled$(feature) : of(false))),
        distinctUntilChanged()
      ),
      this.elseSet$,
    ])
      .pipe(takeUntilDestroyed())
      .subscribe(([enabled, elseSet]) => {
        this.viewContainer.clear();
        if (enabled) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else if (elseSet && this.otherTemplateRef) {
          this.viewContainer.createEmbeddedView(this.otherTemplateRef);
        }
        this.cdRef.markForCheck();
      });
  }

  @Input() set ishFeature(feature: 'always' | 'never' | FeatureToggleType) {
    this.feature$.next(feature);
  }

  @Input() set ishFeatureElse(otherTemplateRef: TemplateRef<unknown>) {
    this.otherTemplateRef = otherTemplateRef;
    this.elseSet$.next(true);
  }
}
