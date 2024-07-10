import { ChangeDetectionStrategy, Component, Input, OnInit, forwardRef, inject } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-buyers-select',
  templateUrl: './buyers-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => BuyersSelectComponent),
    },
  ],
})
@GenerateLazyComponent()
export class BuyersSelectComponent implements OnInit {
  @Input() control: FormControl;

  private organizationManagementFacade = inject(OrganizationManagementFacade);

  buyers$ = this.organizationManagementFacade.users$;

  ngOnInit() {
    this.organizationManagementFacade.fetchUsers();
  }
}
