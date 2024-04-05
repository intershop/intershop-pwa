import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, verify } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';
import { OrderTemplatePreferencesDialogComponent } from '../order-template-preferences-dialog/order-template-preferences-dialog.component';

import { BasketCreateOrderTemplateComponent } from './basket-create-order-template.component';

describe('Basket Create Order Template Component', () => {
  let component: BasketCreateOrderTemplateComponent;
  let fixture: ComponentFixture<BasketCreateOrderTemplateComponent>;
  let element: HTMLElement;

  let orderTemplatesFacadeMock: OrderTemplatesFacade;

  beforeEach(async () => {
    orderTemplatesFacadeMock = mock(OrderTemplatesFacade);

    await TestBed.configureTestingModule({
      declarations: [BasketCreateOrderTemplateComponent, MockComponent(OrderTemplatePreferencesDialogComponent)],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AccountFacade, useFactory: () => instance(mock(AccountFacade)) },
        { provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacadeMock) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCreateOrderTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render the create order-template from basket button', () => {
    fixture.detectChanges();

    expect(element.querySelector('button[data-testing-id=addBasketToOrderTemplateButton]')).toBeTruthy();
  });

  it('should trigger createOrderTemplatesFromLineItems when createOrderTemplates is called', () => {
    component.createOrderTemplate({ id: 'orderTemplateId' } as OrderTemplate);

    verify(orderTemplatesFacadeMock.createOrderTemplateFromLineItems(anything(), anything())).once();
  });
});
