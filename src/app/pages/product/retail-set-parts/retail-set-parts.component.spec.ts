import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { RetailSetPartsComponent } from './retail-set-parts.component';

describe('Retail Set Parts Component', () => {
  let component: RetailSetPartsComponent;
  let fixture: ComponentFixture<RetailSetPartsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductItemComponent),
        RetailSetPartsComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailSetPartsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.parts = [{ sku: '1', quantity: 2 }, { sku: '2', quantity: 2 }, { sku: '3', quantity: 2 }];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display elements for each part', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-add-to-basket",
        "ish-product-item",
        "ish-product-item",
        "ish-product-item",
      ]
    `);
  });
});
