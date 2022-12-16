import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { anything, capture, spy, verify } from 'ts-mockito';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { findAllDataTestingIDs } from 'ish-core/utils/dev/html-query-utils';

import { ProductVariationSelectDefaultComponent } from './product-variation-select-default.component';

describe('Product Variation Select Default Component', () => {
  let component: ProductVariationSelectDefaultComponent;
  let fixture: ComponentFixture<ProductVariationSelectDefaultComponent>;
  let element: HTMLElement;

  const group = { id: 'a', options: [{ value: 'B' }, { value: 'C' }] } as VariationOptionGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductVariationSelectDefaultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationSelectDefaultComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.group = group;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should initialize form of option group', () => {
    fixture.detectChanges();

    expect(findAllDataTestingIDs(fixture)).toMatchInlineSnapshot(`
      Array [
        "a",
        "a-B",
        "a-C",
      ]
    `);
  });

  it('should set active values for form', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('select[data-testing-id=a]')).nativeElement.value).toMatchInlineSnapshot(
      `"B"`
    );
  });

  it('should trigger changeOption output handler if select value changes', () => {
    fixture.detectChanges();
    const emitter = spy(component.changeOption);
    const select = fixture.debugElement.query(By.css('select')).nativeElement;
    select.value = 'C';
    select.dispatchEvent(new Event('change'));

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
      Object {
        "group": "a",
        "value": "C",
      }
    `);
  });
});
