import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';

import { RequisitionBuyerApprovalComponent } from '../../components/requisition-buyer-approval/requisition-buyer-approval.component';
import { RequisitionRejectDialogComponent } from '../../components/requisition-reject-dialog/requisition-reject-dialog.component';
import { RequisitionSummaryComponent } from '../../components/requisition-summary/requisition-summary.component';
import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

import { RequisitionDetailPageComponent } from './requisition-detail-page.component';

describe('Requisition Detail Page Component', () => {
  let component: RequisitionDetailPageComponent;
  let fixture: ComponentFixture<RequisitionDetailPageComponent>;
  let element: HTMLElement;
  let reqFacade: RequisitionManagementFacade;

  beforeEach(async () => {
    reqFacade = mock(RequisitionManagementFacade);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(AddressComponent),
        MockComponent(BasketCostSummaryComponent),
        MockComponent(ErrorMessageComponent),
        MockComponent(FaIconComponent),
        MockComponent(InfoBoxComponent),
        MockComponent(LineItemListComponent),
        MockComponent(LoadingComponent),
        MockComponent(RequisitionBuyerApprovalComponent),
        MockComponent(RequisitionRejectDialogComponent),
        MockComponent(RequisitionSummaryComponent),
        RequisitionDetailPageComponent,
      ],
      providers: [{ provide: RequisitionManagementFacade, useFactory: () => instance(reqFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const requisition = {
      id: '4711',
      requisitionNo: '4712',
      approval: {
        status: 'Approval Pending',
        statusCode: 'pending',
        customerApprovers: [
          { firstName: 'Jack', lastName: 'Link' },
          { firstName: 'Bernhhard', lastName: 'Boldner' },
        ],
      },
      user: { firstName: 'Patricia', lastName: 'Miller' },
      totals: undefined,
      creationDate: 24324321,
      lineItemCount: 2,
      lineItems: undefined,
    } as Requisition;

    when(reqFacade.requisition$(anyString())).thenReturn(of(requisition));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display only the title if there is no requisition given', () => {
    when(reqFacade.requisition$).thenReturn();

    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <div class="float-right">
        <ul class="share-tools">
          <li>
            <a class="link-print" href="javascript:window.print();" rel="nofollow"
              ><fa-icon ng-reflect-icon="fas,print"></fa-icon
              ><span class="share-label">account.orderdetails.print_link.text</span></a
            >
          </li>
        </ul>
      </div>
      <h1>approval.detailspage.heading</h1>
      <ish-error-message></ish-error-message>
    `);
  });
});
