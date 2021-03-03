import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductInventoryComponent } from './product-inventory.component';

describe('Product Inventory Component', () => {
  let component: ProductInventoryComponent;
  let fixture: ComponentFixture<ProductInventoryComponent>;
  let translate: TranslateService;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'inventory')).thenReturn(of(true));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProductInventoryComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInventoryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show In Stock when product available', () => {
    translate.set('product.instock.text', 'In Stock');
    when(context.select('product', 'available')).thenReturn(of(true));

    fixture.detectChanges();
    expect(element.querySelector('.product-availability').textContent).toContain('In Stock');
    expect(
      element.querySelector("link[itemprop='availability']").getAttribute('href') === 'http://schema.org/InStock'
    ).toBeTruthy();
  });

  it('should show Out of Stock when product not available', () => {
    translate.set('product.out_of_stock.text', 'Out of Stock');
    when(context.select('product', 'available')).thenReturn(of(false));

    fixture.detectChanges();
    expect(element.querySelector('.product-availability').textContent).toContain('Out of Stock');
    expect(
      element.querySelector("link[itemprop='availability']").getAttribute('href') === 'http://schema.org/OutOfStock'
    ).toBeTruthy();
  });
});
