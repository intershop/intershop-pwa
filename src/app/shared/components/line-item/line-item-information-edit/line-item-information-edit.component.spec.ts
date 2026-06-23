import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { CustomFieldsFormlyComponent } from 'ish-shared/components/custom-fields/custom-fields-formly/custom-fields-formly.component';
import { LineItemCustomFieldsComponent } from 'ish-shared/components/line-item/line-item-custom-fields/line-item-custom-fields.component';

import { LineItemInformationEditComponent } from './line-item-information-edit.component';

describe('Line Item Information Edit Component', () => {
  let component: LineItemInformationEditComponent;
  let fixture: ComponentFixture<LineItemInformationEditComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let checkoutFacade: CheckoutFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    checkoutFacade = mock(CheckoutFacade);
    when(checkoutFacade.customFieldsForScope$('BasketLineItem')).thenReturn(
      of([
        { name: 'field1', editable: true },
        { name: 'field2', editable: false },
        { name: 'field3', editable: true },
      ])
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslatePipe],
      declarations: [
        LineItemInformationEditComponent,
        MockComponent(CustomFieldsFormlyComponent),
        MockComponent(LineItemCustomFieldsComponent),
        MockDirective(NgbCollapse),
      ],
      providers: [provideTranslateService()],
    })
      .overrideComponent(LineItemInformationEditComponent, {
        set: {
          providers: [
            { provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) },
            { provide: ProductContextFacade, useFactory: () => instance(context) },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemInformationEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.lineItem = {
      id: '123',
      productSKU: 'SKU123',
      customFields: { field1: 'Value 1', field2: undefined, field3: 'Value 3' },
    };
    component.editable = true;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render nothing if there are no custom fields', () => {
    when(checkoutFacade.customFieldsForScope$('BasketLineItem')).thenReturn(of([]));
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should render the custom fields component if there are custom fields', () => {
    fixture.detectChanges();
    expect(element.querySelector('ish-line-item-custom-fields')).toBeTruthy();
  });

  it('should not render the custom fields component if the form is expanded', () => {
    component.collapsed = false;
    fixture.detectChanges();
    expect(element.querySelector('ish-line-item-custom-fields')).toBeFalsy();
  });

  it('should render the toggle link if there are custom fields', () => {
    fixture.detectChanges();
    expect(element.querySelector('button.line-item-edit-link')).toMatchInlineSnapshot(`null`);
  });

  it('should not render the toggle link if the fields are not editable', () => {
    component.editable = false;
    fixture.detectChanges();
    expect(element.querySelector('button.line-item-edit-link')).toBeFalsy();
  });

  it('should render the form if there are custom fields', () => {
    fixture.detectChanges();
    expect(element.querySelector('form')).toBeTruthy();
  });
});
