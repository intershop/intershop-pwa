import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrganizationHierarchiesFacade } from '../../../facades/organization-hierarchies.facade';
import { OrganizationHierarchiesGroup } from '../../../models/organization-hierarchies-group/organization-hierarchies-group.model';

@Component({
  selector: 'ish-organization-hierarchies-create-group',
  templateUrl: './organization-hierarchies-create-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationHierarchiesCreateGroupComponent implements OnInit {
  @Input() resetForm = false;
  @Input() selectedParentGroup$: Observable<OrganizationHierarchiesGroup>;

  @Output() save = new EventEmitter<{ parentGroupId: string; child: OrganizationHierarchiesGroup }>();
  @Output() cancel = new EventEmitter();

  form: FormGroup;
  extensionForm: FormGroup = new FormGroup({});

  submitted = false;

  groupForm: FormGroup = this.fb.group({});

  items$: Observable<OrganizationHierarchiesGroup[]>;

  constructor(private fb: FormBuilder, private organizationFacade: OrganizationHierarchiesFacade) {}

  ngOnInit(): void {
    this.items$ = this.organizationFacade.groups$;

    // create form for creating a new address
    this.form = new FormGroup({
      groupForm: new FormGroup({}),
    });
  }
  get formDisabled() {
    return this.groupForm.invalid && this.submitted;
  }

  get groupName(): FormGroup {
    return this.groupForm.get('groupName') as FormGroup;
  }

  get parentGroup(): FormGroup {
    return this.groupForm.get('parentGroup') as FormGroup;
  }

  doResetForm(resetForm: boolean) {
    if (resetForm && this.form) {
      this.form.reset();
      this.submitted = false;
    }
  }

  submitForm() {
    // if the form is invalid only mark all invalid fields
    if (this.groupForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.groupForm);
      return;
    }

    const formValue = this.groupForm.value;

    const group: OrganizationHierarchiesGroup = {
      id: uuid(),
      displayName: formValue.groupName,
      description: formValue.groupDescription === '' ? undefined : formValue.groupDescription,
    };

    this.save.emit({ parentGroupId: formValue.parentGroupId, child: group });
  }

  cancelForm() {
    this.cancel.emit();
  }
}
