import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-buyers-select',
  templateUrl: './buyers-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgFor, TranslatePipe, FormlyModule, AsyncPipe, ReactiveFormsModule],
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
