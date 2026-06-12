import { ChangeDetectorRef, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

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
  private roleId$ = new BehaviorSubject<string | string[]>(undefined);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private roleToggleService: RoleToggleService,
    private cdRef: ChangeDetectorRef
  ) {
    this.roleId$
      .pipe(
        switchMap(roleId => (roleId ? this.roleToggleService.hasRole(roleId) : of(false))),
        map(val => !val),
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

  @Input() set ishHasNotRole(roleId: string | string[]) {
    this.roleId$.next(roleId);
  }
}
