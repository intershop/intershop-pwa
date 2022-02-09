import { ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { AuthorizationToggleService } from 'ish-core/utils/authorization-toggle/authorization-toggle.service';

/**
 * Structural directive.
 * Used on an element, this element will only be rendered if the logged in user has the specified permission or one of the specified permission in case an array is given.
 *
 * @example
 * <div *ishIsAuthorizedTo="APP_B2B_PURCHASE'">
 *   Only visible when the current user is allowed to purchase items.
 * </div>
 * or
 * <div *ishIsAuthorizedTo="['APP_B2B_ORDER_APPROVAL', 'APP_B2B_MANAGE_COSTCENTER']">
 *   Only visible when the current user has at least one of the given permissions.
 * </div>
 */
@Directive({
  selector: '[ishIsAuthorizedTo]',
})
export class AuthorizationToggleDirective implements OnDestroy {
  private subscription: Subscription;
  private enabled$ = new ReplaySubject<boolean>(1);

  private destroy$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authorizationToggle: AuthorizationToggleService
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

  @Input() set ishIsAuthorizedTo(permission: string | string[]) {
    // end previous subscription and subscribe to new permission
    if (this.subscription) {
      // eslint-disable-next-line ban/ban
      this.subscription.unsubscribe();
    }
    this.subscription = this.authorizationToggle
      .isAuthorizedTo(permission)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ next: val => this.enabled$.next(val) });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
