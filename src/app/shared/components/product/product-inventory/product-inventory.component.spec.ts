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
    when(context.select('inventory', 'inStock')).thenReturn(of(true));
    when(context.select('inventory', 'availableStock')).thenReturn(of(-1));

    await TestBed.configureTestingModule({
      imports: [ProductInventoryComponent, TranslateModule.forRoot()],
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

    fixture.detectChanges();
    expect(element.querySelector('.product-availability').textContent).toContain('In Stock');
    expect(
      element.querySelector("link[itemprop='availability']").getAttribute('href') === 'http://schema.org/InStock'
    ).toBeTruthy();
  });

  it('should show Out of Stock when product not available', () => {
    translate.set('product.out_of_stock.text', 'Out of Stock');
    when(context.select('inventory', 'inStock')).thenReturn(of(false));

    fixture.detectChanges();
    expect(element.querySelector('.product-availability').textContent).toContain('Out of Stock');
    expect(
      element.querySelector("link[itemprop='availability']").getAttribute('href') === 'http://schema.org/OutOfStock'
    ).toBeTruthy();
  });

  describe('extended display type', () => {
    const supplierStocks = [
      { id: 'warehouse-c', displayName: 'C Warehouse', inStock: true, availableStock: 50 },
      { id: 'warehouse-a', displayName: 'A Warehouse', inStock: true, availableStock: 100 },
      { id: 'warehouse-b', displayName: 'B Warehouse', inStock: false, availableStock: 0 },
    ];

    beforeEach(() => {
      when(context.select('inventory', 'supplierStock')).thenReturn(of(supplierStocks));
      component.displayType = 'extended';
    });

    it('should render supplier stock rows', () => {
      fixture.detectChanges();
      expect(element.querySelectorAll('.stock-label')).toHaveLength(3);
    });

    it('should sort supplier stocks alphabetically by displayName', () => {
      fixture.detectChanges();
      const labels = element.querySelectorAll('.stock-label');
      expect(labels[0].textContent.trim()).toBe('A Warehouse');
      expect(labels[1].textContent.trim()).toBe('B Warehouse');
      expect(labels[2].textContent.trim()).toBe('C Warehouse');
    });

    it('should apply correct stock-level CSS class for each supplier', () => {
      fixture.detectChanges();
      // After sorting: A Warehouse=100 (high), B Warehouse=0 (none), C Warehouse=50 (medium)
      const levelSpans = element.querySelectorAll('.stock-level');
      expect(levelSpans[0].classList).toContain('high');
      expect(levelSpans[1].classList).toContain('none');
      expect(levelSpans[2].classList).toContain('medium');
    });

    it('should not render supplier stock section when supplierStock is empty', () => {
      when(context.select('inventory', 'supplierStock')).thenReturn(of([]));
      fixture.detectChanges();
      expect(element.querySelector('.stock-label')).toBeFalsy();
    });

    it('should not render supplier stock section when supplierStock is undefined', () => {
      when(context.select('inventory', 'supplierStock')).thenReturn(of(undefined));
      fixture.detectChanges();
      expect(element.querySelector('.stock-label')).toBeFalsy();
    });
  });

  describe('getStockLevel', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return "high" for stock >= 100', () => {
      expect(component.getStockLevel(100)).toBe('high');
      expect(component.getStockLevel(200)).toBe('high');
    });

    it('should return "medium" for stock >= 50 and < 100', () => {
      expect(component.getStockLevel(50)).toBe('medium');
      expect(component.getStockLevel(99)).toBe('medium');
    });

    it('should return "low" for stock >= 1 and < 50', () => {
      expect(component.getStockLevel(1)).toBe('low');
      expect(component.getStockLevel(49)).toBe('low');
    });

    it('should return "none" for stock < 1', () => {
      expect(component.getStockLevel(0)).toBe('none');
      expect(component.getStockLevel(-1)).toBe('none');
    });
  });
});
