import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, map } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { OrganizationHierarchiesFacade } from '../../../facades/organization-hierarchies.facade';
import { OrganizationHierarchiesGroup } from '../../../models/organization-hierarchies-group/organization-hierarchies-group.model';

/**
 * The Account Organization Hierarchies Page Component displays the organization hierarchy of a customer.
 * The user can add and delete hierarchy groups.
 */
@Component({
  selector: 'ish-account-hierarchies',
  templateUrl: './account-hierarchies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountHierarchiesComponent implements OnInit {
  @Input() error: HttpError;
  groups$: Observable<OrganizationHierarchiesGroup[]>;
  availableGroups: { label: string; value: string }[] = [];
  selectedGroup$: Observable<OrganizationHierarchiesGroup>;

  isCreateGroupFormCollapsed = true;

  selectNodeConfig: FormlyFieldConfig;
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

  /**
   * new organization hierarchies group is selected
   */
  changeSelectedGroup() {
    this.selectedGroup$ = this.organizationHierarchiesFacade.getDetailsOfGroup$(
      this.maintainGroupForm.value.selectedNode
    );
  }

  /**
   * sub component ish-hierarchies-create-group triggers an event to create a new
   * organization hierarchies group
   */
  createGroup(data: { parentGroupId: string; child: OrganizationHierarchiesGroup }) {
    this.organizationHierarchiesFacade.createAndAddGroup(data.parentGroupId, data.child);
    this.hideCreateGroupForm();
  }

  /**
   * toggle create organization hierarchies group modal
   */
  showCreateGroupForm() {
    this.isCreateGroupFormCollapsed = false;
  }

  /**
   * close create organization hierarchies group modal
   */
  hideCreateGroupForm() {
    this.isCreateGroupFormCollapsed = true;
  }

  /**
   * triggers delete organization hierarchies group action if form is submitted
   */
  deleteGroup() {
    this.selectedGroup$
      .pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef))
      .subscribe(group => this.organizationHierarchiesFacade.deleteGroup(group.id));
  }

  /**
   * Mapping of organization hierarchies group list to a SelectOption list.
   * @param groups$ groups to map
   * @returns the option list for a select box
   */
  private getGroupOptions(groups$: Observable<OrganizationHierarchiesGroup[]>): Observable<SelectOption[]> {
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
}
