import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { CustomFieldsFormlyComponent } from 'ish-shared/components/custom-fields/custom-fields-formly/custom-fields-formly.component';
import { CustomFieldsViewComponent } from 'ish-shared/components/custom-fields/custom-fields-view/custom-fields-view.component';

import { BasketCustomFieldsComponent } from './basket-custom-fields.component';

describe('Basket Custom Fields Component', () => {
  let component: BasketCustomFieldsComponent;
  let fixture: ComponentFixture<BasketCustomFieldsComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.basket$).thenReturn(of(BasketMockData.getBasket()));
    when(checkoutFacade.basketLoading$).thenReturn(of(false));
    when(checkoutFacade.customFieldsForScope$('Basket')).thenReturn(
      of([{ name: 'field1', label: 'Field 1', value: 'Value 1' }])
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        BasketCustomFieldsComponent,
        MockComponent(CustomFieldsFormlyComponent),
        MockComponent(CustomFieldsViewComponent),
        MockComponent(FaIconComponent),
        MockDirective(NgbCollapse),
      ],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
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

  it('should render nothing if there are no custom fields', () => {
    when(checkoutFacade.customFieldsForScope$('Basket')).thenReturn(of([]));
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should render the custom fields view component if there are custom fields', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-custom-fields-view')).toBeTruthy();
  });

  it('should not render the custom fields view component if the form is expanded', () => {
    component.collapsed = false;
    fixture.detectChanges();
    expect(element.querySelector('ish-custom-fields-view')).toBeFalsy();
  });

  it('should render the toggle link if there are custom fields', () => {
    fixture.detectChanges();
    expect(element.querySelector('button')).toMatchInlineSnapshot(`
      <button
        type="button"
        aria-controls="basket-custom-fields-input"
        data-testing-id="basket-custom-fields-toggle-link"
        class="btn btn-link btn-link-with-icon"
        aria-expanded="false"
      >
        checkout.custom-fields.basket.add.link.label <fa-icon ng-reflect-icon="fas,angle-down"></fa-icon>
      </button>
    `);
  });

  it('should render the form if there are custom fields', () => {
    fixture.detectChanges();
    expect(element.querySelector('form')).toBeTruthy();
  });
});
