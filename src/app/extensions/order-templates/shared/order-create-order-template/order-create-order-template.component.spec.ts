import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplatePreferencesDialogComponent } from '../order-template-preferences-dialog/order-template-preferences-dialog.component';

import { OrderCreateOrderTemplateComponent } from './order-create-order-template.component';

describe('Order Create Order Template Component', () => {
  let component: OrderCreateOrderTemplateComponent;
  let fixture: ComponentFixture<OrderCreateOrderTemplateComponent>;
  let element: HTMLElement;

  let orderTemplatesFacadeMock: OrderTemplatesFacade;

  beforeEach(async () => {
    orderTemplatesFacadeMock = mock(OrderTemplatesFacade);

    when(orderTemplatesFacadeMock.orderTemplateLoading$).thenReturn(of(false));

    await TestBed.configureTestingModule({
      declarations: [MockComponent(OrderTemplatePreferencesDialogComponent), OrderCreateOrderTemplateComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: OrderTemplatesFacade, useFactory: () => instance(orderTemplatesFacadeMock) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCreateOrderTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render the create order-template from order button', () => {
    fixture.detectChanges();

    expect(element.querySelector('button')).toBeTruthy();
  });

  it('should trigger createOrderTemplatesFromLineItems when createOrderTemplates is called', () => {
    component.createOrderTemplate(anything());

    verify(orderTemplatesFacadeMock.createOrderTemplateFromLineItems(anything(), anything())).once();
  });
});
