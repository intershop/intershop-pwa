import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { BasketApprovalInfoComponent } from 'ish-shared/components/basket/basket-approval-info/basket-approval-info.component';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';

import { CheckoutReceiptRequisitionComponent } from './checkout-receipt-requisition.component';

describe('Checkout Receipt Requisition Component', () => {
  let component: CheckoutReceiptRequisitionComponent;
  let fixture: ComponentFixture<CheckoutReceiptRequisitionComponent>;
  let element: HTMLElement;
  let reqFacade: RequisitionManagementFacade;

  beforeEach(async () => {
    reqFacade = mock(RequisitionManagementFacade);
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutReceiptRequisitionComponent,
        MockComponent(BasketApprovalInfoComponent),
        MockDirective(ServerHtmlDirective),
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: RequisitionManagementFacade, useFactory: () => instance(reqFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutReceiptRequisitionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.basket = BasketMockData.getBasket();

    when(reqFacade.requisition$(component.basket.id)).thenReturn(of({ requisitionNo: 'req001' } as Requisition));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the document number after creation', () => {
    fixture.detectChanges();
    expect(element.querySelector('[data-testing-id="requisition-number"]').innerHTML.trim()).toContain('req001');
  });
});
