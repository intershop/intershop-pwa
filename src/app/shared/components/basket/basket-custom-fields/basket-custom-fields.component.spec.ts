import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CustomFieldsFormlyComponent } from 'ish-shared/components/custom-fields/custom-fields-formly/custom-fields-formly.component';
import { CustomFieldsViewComponent } from 'ish-shared/components/custom-fields/custom-fields-view/custom-fields-view.component';

import { BasketCustomFieldsComponent } from './basket-custom-fields.component';

describe('Basket Custom Fields Component', () => {
  let component: BasketCustomFieldsComponent;
  let fixture: ComponentFixture<BasketCustomFieldsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basket$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [
        BasketCustomFieldsComponent,
        MockComponent(CustomFieldsFormlyComponent),
        MockComponent(CustomFieldsViewComponent),
      ],
      providers: [
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketCustomFieldsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
