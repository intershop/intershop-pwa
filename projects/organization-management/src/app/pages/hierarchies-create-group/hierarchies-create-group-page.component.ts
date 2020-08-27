import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-hierarchies-create-group-page',
  templateUrl: './hierarchies-create-group-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HierarchiesCreateGroupPageComponent implements OnInit {
  form: FormGroup = this.fb.group({
    group: this.fb.group({
      name: ['', [Validators.required]],
      parent: ['', [Validators.required]],
      description: [''],
    }),
  });
  submitted = false;
  loading$: Observable<boolean>;
  error$: Observable<HttpError>;

  constructor(private fb: FormBuilder, private organizationManagementFacade: OrganizationManagementFacade) {}

  ngOnInit(): void {
    this.loading$ = this.organizationManagementFacade.groupsLoading$;
    this.error$ = this.organizationManagementFacade.groupsError$;
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }

  get group() {
    return this.form.get('group');
  }
}
