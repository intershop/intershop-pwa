import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-buyers-select',
  templateUrl: './buyers-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class BuyersSelectComponent implements OnInit {
  @Input({ required: true }) control: FormControl;
  @Input() field: Partial<FormlyFieldConfig>;

  private organizationManagementFacade = inject(OrganizationManagementFacade);

  buyers$ = this.organizationManagementFacade.users$;

  ngOnInit() {
    this.organizationManagementFacade.fetchUsers();
  }
}
