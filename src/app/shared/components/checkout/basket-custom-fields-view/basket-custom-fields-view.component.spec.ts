import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { CustomFieldsViewComponent } from 'ish-shared/components/custom-fields/custom-fields-view/custom-fields-view.component';

import { BasketCustomFieldsViewComponent } from './basket-custom-fields-view.component';

describe('Basket Custom Fields View Component', () => {
  let component: BasketCustomFieldsViewComponent;
  let fixture: ComponentFixture<BasketCustomFieldsViewComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.customFieldsForScope$('Basket')).thenReturn(
      of([{ name: 'field1', label: 'Field 1', value: 'Value 1' }])
    );

    await TestBed.configureTestingModule({
      declarations: [BasketCustomFieldsViewComponent, MockComponent(CustomFieldsViewComponent)],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCustomFieldsViewComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.data = { ...BasketMockData.getBasket(), customFields: { field1: 'Value 1' } };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display custom fields', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-custom-fields-view')).toBeTruthy();
  });
});
