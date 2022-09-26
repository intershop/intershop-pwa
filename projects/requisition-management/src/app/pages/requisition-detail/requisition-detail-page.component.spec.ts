import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AuthorizationToggleDirective } from 'ish-core/directives/authorization-toggle.directive';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';

import { RequisitionContextFacade } from '../../facades/requisition-context.facade';
import { Requisition } from '../../models/requisition/requisition.model';

import { RequisitionCostCenterApprovalComponent } from './requisition-cost-center-approval/requisition-cost-center-approval.component';
import { RequisitionDetailPageComponent } from './requisition-detail-page.component';
import { RequisitionRejectDialogComponent } from './requisition-reject-dialog/requisition-reject-dialog.component';
import { RequisitionSummaryComponent } from './requisition-summary/requisition-summary.component';

describe('Requisition Detail Page Component', () => {
  let component: RequisitionDetailPageComponent;
  let fixture: ComponentFixture<RequisitionDetailPageComponent>;
  let element: HTMLElement;
  let context: RequisitionContextFacade;

  beforeEach(async () => {
    context = mock(RequisitionContextFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(AddressComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(BasketShippingMethodComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(RequisitionCostCenterApprovalComponent),
        MockComponent(RequisitionRejectDialogComponent),
        MockComponent(RequisitionSummaryComponent),
        MockDirective(AuthorizationToggleDirective),
        RequisitionDetailPageComponent,
      ],
    })
      .overrideComponent(RequisitionDetailPageComponent, {
        set: { providers: [{ provide: RequisitionContextFacade, useFactory: () => instance(context) }] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(context.select('entity')).thenReturn(of({ approval: {} } as Requisition));
    when(context.select('view')).thenReturn(of('approver'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display standard elements by default', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "fa-icon",
        "ish-error-message",
        "ish-requisition-summary",
        "ish-requisition-cost-center-approval",
        "ish-info-box",
        "ish-address",
        "ish-info-box",
        "ish-info-box",
        "ish-address",
        "ish-info-box",
        "ish-basket-shipping-method",
        "ish-basket-cost-summary",
        "ish-requisition-reject-dialog",
      ]
    `);
  });
});
