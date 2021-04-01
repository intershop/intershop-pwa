import { ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { RoleToggleService } from 'ish-core/utils/role-toggle/role-toggle.service';

/**
 * Structural directive.
 * Used on an element, this element will only be rendered if the logged in user has NOT the specified role or one of the specified roles.
 *
 * @example
 * <div *ishHasNotRole="'APP_B2B_OCI_USER'">
 *   Only visible when the current user is not an OCI punchout user.
 * </div>
 * or
 * <div *ishHasNotRole="['APP_B2B_CXML_USER', 'APP_B2B_OCI_USER']">
 *   Only visible when the current user is not an OCI punchout user.
 * </div>
 */
@Directive({
  selector: '[ishHasNotRole]',
})
export class NotRoleToggleDirective implements OnDestroy {
  private subscription: Subscription;
  private enabled$ = new ReplaySubject<boolean>(1);

  private destroy$ = new Subject();

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private roleToggleService: RoleToggleService,
    private cdRef: ChangeDetectorRef
  ) {
    this.enabled$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(enabled => {
      if (enabled) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
      this.cdRef.markForCheck();
    });
  }

  @Input() set ishHasNotRole(roleId: string | string[]) {
    // end previous subscription and newly subscribe
    if (this.subscription) {
      // tslint:disable-next-line: ban
      this.subscription.unsubscribe();
    }
    this.subscription = this.roleToggleService
      .hasRole(roleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: val => this.enabled$.next(!val) });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
