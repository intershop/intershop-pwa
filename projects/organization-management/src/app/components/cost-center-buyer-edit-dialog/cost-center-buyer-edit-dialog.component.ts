import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { PriceHelper } from 'ish-core/models/price/price.helper';
import { focusFirstInvalidField, markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { FormsService } from 'ish-shared/forms/utils/forms.service';

import { OrganizationManagementFacade } from '../../facades/organization-management.facade';

@Component({
  selector: 'ish-cost-center-buyer-edit-dialog',
  templateUrl: './cost-center-buyer-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CostCenterBuyerEditDialogComponent implements OnInit {
  model: { buyerName: string; budgetValue: number; budgetPeriod: string };
  modal: NgbModalRef;
  modalHeader = 'account.costcenter.details.buyers.action.editbudget.title';

  costCenterBuyerForm = new FormGroup({});
  fields: FormlyFieldConfig[];
  private submitted = false;

  buyer: CostCenterBuyer;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(
    private ngbModal: NgbModal,
    private appFacade: AppFacade,
    private organizationManagementFacade: OrganizationManagementFacade
  ) {}

  ngOnInit() {
    this.fields = this.getFields();
  }

  private getFields() {
    return [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'buyerName',
            type: 'ish-plain-text-field',
            className: 'col-8',
            props: {
              labelClass: 'col-4',
              fieldClass: 'col-8',
              label: 'account.costcenter.details.buyers.list.header.name',
            },
          },
          {
            key: 'budgetValue',
            type: 'ish-text-input-field',
            className: ' col-6 col-md-8',
            props: {
              postWrappers: [{ wrapper: 'input-addon', index: -1 }],
              labelClass: 'col-md-4',
              fieldClass: 'col-md-8  pr-0',
              label: 'account.costcenter.details.buyers.dialog.editbudget.budget.label',
              addonLeft: {
                text: this.appFacade.currencySymbol$(this.buyer?.budget?.currency),
              },
              mask: 'separator.2',
            },
          },
          {
            key: 'budgetPeriod',
            type: 'ish-select-field',
            className: 'col-6 col-md-4',
            props: {
              fieldClass: 'col-12 label-empty',
              options: FormsService.getCostCenterBudgetPeriodOptions(),
            },
          },
        ],
      },
    ];
  }

  submitCostCenterBuyerForm() {
    if (this.costCenterBuyerForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.costCenterBuyerForm);
      focusFirstInvalidField(this.costCenterBuyerForm);
      return;
    }

    const changedBuyer: CostCenterBuyer = {
      login: this.buyer.login,
      firstName: this.buyer.firstName,
      lastName: this.buyer.lastName,
      budget: PriceHelper.getPrice(this.buyer.budget.currency, this.model.budgetValue ?? 0),
      budgetPeriod: this.model.budgetPeriod,
    };

    this.organizationManagementFacade.updateCostCenterBuyer(changedBuyer);
    this.hide();
  }

  get formDisabled() {
    return this.costCenterBuyerForm.invalid && this.submitted;
  }

  /** Opens the modal. */
  show(buyer: CostCenterBuyer) {
    this.buyer = buyer;
    this.model = {
      buyerName: `${buyer.firstName} ${buyer.lastName}`,
      budgetValue: buyer.budget.value,
      budgetPeriod: buyer.budgetPeriod,
    };

    this.modal = this.ngbModal.open(this.modalTemplate, { size: 'lg' });
  }

  /** Close the modal. */
  hide() {
    if (this.modal) {
      this.modal.close();
    }
  }
}
