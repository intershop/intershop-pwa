import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';
import { Node, NodeTree } from '../../models/node/node.model';

@Component({
  selector: 'ish-hierarchies-create-group-page',
  templateUrl: './hierarchies-create-group-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchiesCreateGroupPageComponent implements OnInit {
  form: FormGroup = this.fb.group({
    org_group: this.fb.group({
      name: ['', [Validators.required]],
      parent: ['', [Validators.required]],
      description: [''],
    }),
  });
  submitted = false;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;
  items$: Observable<NodeTree>;

  constructor(private fb: FormBuilder, private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit(): void {
    this.loading$ = this.organizationManagementFacade.groupsLoading$;
    this.error$ = this.organizationManagementFacade.groupsError$;
    this.items$ = this.organizationManagementFacade.groups$();
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const formValue = this.form.value;

    const child: Node = {
      id: UUID.UUID(),
      name: formValue.org_group.name,
      description: formValue.org_group.description === '' ? undefined : formValue.org_group.description,
    };

    const parent: Node = {
      id: formValue.org_group.parent,
      name: formValue.org_group.parent,
    };

    this.organizationManagementFacade.createAndAddGroup(parent, child);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }

  get group() {
    return this.form.get('org_group');
  }
}
