import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';

import { ProductQuantityComponent } from './product-quantity.component';

describe('Product Quantity Component', () => {
  let component: ProductQuantityComponent;
  let fixture: ComponentFixture<ProductQuantityComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'quantity')).thenReturn(of(true));
    when(context.select('quantity')).thenReturn(of(2));
    when(context.select('minQuantity')).thenReturn(of(2));
    when(context.select('maxQuantity')).thenReturn(of(6));
    when(context.select('stepQuantity')).thenReturn(of(2));
    const hasQuantityError$ = of(false);
    when(context.select('hasQuantityError')).thenReturn(hasQuantityError$);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProductQuantityComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductQuantityComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.elementId = 'ASDF';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render when display is false', () => {
    when(context.select('displayProperties', 'quantity')).thenReturn(of(false));
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should display counter input when type is not selected', () => {
    fixture.detectChanges();
    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      [
        "decrease-quantity-ASDF",
        "increase-quantity-ASDF",
        "quantity",
      ]
    `);

    expect(element.querySelector('input')).toMatchInlineSnapshot(`
      <input
        data-testing-id="quantity"
        type="number"
        pattern="[0-9]*"
        class="form-control text-center"
        id="ASDF"
        min="2"
        max="6"
        step="2"
        aria-label="product.quantity.aria_label"
      />
    `);
  });

  it('should display number input when type is input', () => {
    component.type = 'input';

    fixture.detectChanges();
    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      [
        "quantity",
      ]
    `);
    expect(element.querySelector('input[data-testing-id="quantity"]').getAttribute('type')).toContain('number');
  });

  it('should display select when type is select', () => {
    component.type = 'select';

    fixture.detectChanges();
    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      [
        "quantity",
      ]
    `);
    expect(element.querySelector('select')).toMatchInlineSnapshot(`
      <select data-testing-id="quantity" class="form-control" id="ASDF">
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="6">6</option>
      </select>
    `);
  });
});
