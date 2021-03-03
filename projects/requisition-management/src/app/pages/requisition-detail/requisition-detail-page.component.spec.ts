import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';

import { RequisitionContextFacade } from '../../facades/requisition-context.facade';

import { RequisitionBuyerApprovalComponent } from './requisition-buyer-approval/requisition-buyer-approval.component';
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

    when(context.select('entity')).thenReturn(of());
    when(context.select('view')).thenReturn(of('approver'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the requisition title for default', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <div>
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
        <h1>approval.detailspage.approval.heading</h1>
        <ish-error-message></ish-error-message>
      </div>
    `);
  });
});
