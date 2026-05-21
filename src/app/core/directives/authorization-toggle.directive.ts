import { ChangeDetectorRef, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, of } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';

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
  standalone: false,
})
export class AuthorizationToggleDirective {
  private permission$ = new BehaviorSubject<string | string[]>(undefined);

  constructor(
    private cdRef: ChangeDetectorRef,
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authorizationToggle: AuthorizationToggleService
  ) {
    this.permission$
      .pipe(
        switchMap(permission => (permission ? this.authorizationToggle.isAuthorizedTo(permission) : of(false))),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(enabled => {
        if (enabled) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
        this.cdRef.markForCheck();
      });
  }

  @Input() set ishIsAuthorizedTo(permission: string | string[]) {
    this.permission$.next(permission);
  }
}
