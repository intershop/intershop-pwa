import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { whenTruthy } from 'ish-core/utils/operators';

/**
 * Structural directive.
 * Used on an element, this element will only be rendered if the sorder approval service is enable.
 *
 * @example
 * <div *ishOrderApproval>
 *   Only visible when order approval is enabled.
 * </div>
 */
@Directive({
  selector: '[ishOrderApproval]',
})
export class OrderApprovalDirective implements OnInit, OnDestroy {
  // tslint:disable-next-line: no-any
  private destroy$ = new Subject();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private appFacade: AppFacade
  ) {}

  ngOnInit(): void {
    this.appFacade.orderApprovalEnabled$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(enabled => {
      this.viewContainer.clear();
      if (enabled) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
