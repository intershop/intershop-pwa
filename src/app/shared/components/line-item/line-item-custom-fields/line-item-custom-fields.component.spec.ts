import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CustomFieldsViewComponent } from 'ish-shared/components/custom-fields/custom-fields-view/custom-fields-view.component';

import { LineItemCustomFieldsComponent } from './line-item-custom-fields.component';

describe('Line Item Custom Fields Component', () => {
  let component: LineItemCustomFieldsComponent;
  let fixture: ComponentFixture<LineItemCustomFieldsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.customFieldsForScope$('BasketLineItem')).thenReturn(
      of([
        { name: 'field1', editable: true },
        { name: 'field2', editable: false },
        { name: 'field3', editable: true },
      ])
    );

    await TestBed.configureTestingModule({
      declarations: [LineItemCustomFieldsComponent, MockComponent(CustomFieldsViewComponent)],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemCustomFieldsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.lineItem = { customFields: { field1: 'Value 1', field2: undefined, field3: 'Value 3' } };
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be render the custom fields view', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(
      `<ish-custom-fields-view ng-reflect-fields="[object Object],[object Object"></ish-custom-fields-view>`
    );
  });
});
