import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, map } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrganizationHierarchiesFacade } from '../../../facades/organization-hierarchies.facade';
import { OrganizationGroup } from '../../../models/organization-group/organization-group.model';

/**
 * The Account Address Page Component displays the preferred InvoiceTo and ShipTo addresses of the user
 * and any further addresses. The user can add and delete addresses. It is mandatory to have at least one address.
 */
@Component({
  selector: 'ish-account-hierarchies',
  templateUrl: './account-hierarchies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountHierarchiesComponent implements OnInit {
  @Input() error: HttpError;
  groups$: Observable<OrganizationGroup[]>;
  selectedGroup$: Observable<OrganizationGroup>;

  isCreateGroupFormCollapsed = true;
  dynamicTreeFocus = false;

  selectNodeConfig: FormlyFieldConfig;
  dynamicTreeConfig: FormlyFieldConfig = {
    key: 'active',
    type: 'ish-checkbox-field',
    defaultValue: this.dynamicTreeFocus,
    props: {
      fieldClass: 'offset-1',
      label: 'account.organization.hierarchies.tree.checkbox.label',
    },
  };
  dynamicTreeForm: FormGroup = new FormGroup({});
  maintainGroupForm: FormGroup = new FormGroup({});

  private destroyRef = inject(DestroyRef);

  constructor(private organizationHierarchiesFacade: OrganizationHierarchiesFacade) {}

  ngOnInit(): void {
    this.groups$ = this.organizationHierarchiesFacade.groups$;

    this.selectedGroup$ = this.organizationHierarchiesFacade.getRootGroup$;
    // Selectbox formly configurations
    this.selectNodeConfig = {
      key: 'selectedNode',
      type: 'ish-select-field',
      props: {
        fieldClass: 'col-12 label-empty',
        options: this.getGroupOptions(this.groups$),
        placeholder: 'account.organization.hierarchies.groups.select.placeholder',
      },
    };
  }

  changeDynamicTreeFocus() {
    this.dynamicTreeFocus = this.dynamicTreeForm.value.active;
  }

  changeSelectedGroup() {
    this.selectedGroup$ = this.organizationHierarchiesFacade.getDetailsOfGroup$(
      this.maintainGroupForm.value.selectedNode
    );
  }

  createGroup(data: { parentGroupId: string; child: OrganizationGroup }) {
    this.organizationHierarchiesFacade.createAndAddGroup(data.parentGroupId, data.child);
    this.hideCreateGroupForm();
  }

  showCreateGroupForm() {
    this.isCreateGroupFormCollapsed = false;
  }

  hideCreateGroupForm() {
    this.isCreateGroupFormCollapsed = true;
  }

  private getGroupOptions(groups$: Observable<OrganizationGroup[]>): Observable<SelectOption[]> {
    return groups$.pipe(
      whenTruthy(),
      map(groups =>
        groups.map(g => ({
          label: g.displayName,
          value: g.id,
        }))
      )
    );
  }

  deleteGroup() {
    this.selectedGroup$
      .pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef))
      .subscribe(group => this.organizationHierarchiesFacade.deleteGroup(group.id));
  }
}
