import { ChangeDetectorRef, DestroyRef, Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReplaySubject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

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
export class NotRoleToggleDirective {
  private subscription: Subscription;
  private enabled$ = new ReplaySubject<boolean>(1);

  private destroyRef = inject(DestroyRef);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private roleToggleService: RoleToggleService,
    private cdRef: ChangeDetectorRef
  ) {
    this.enabled$.pipe(distinctUntilChanged(), takeUntilDestroyed()).subscribe(enabled => {
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
      // eslint-disable-next-line ban/ban
      this.subscription.unsubscribe();
    }
    this.subscription = this.roleToggleService
      .hasRole(roleId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: val => this.enabled$.next(!val) });
  }
}
