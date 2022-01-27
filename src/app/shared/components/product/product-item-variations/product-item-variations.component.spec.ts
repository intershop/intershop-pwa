import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';

import { ProductItemVariationsComponent } from './product-item-variations.component';

describe('Product Item Variations Component', () => {
  let component: ProductItemVariationsComponent;
  let fixture: ComponentFixture<ProductItemVariationsComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  async function prepareTestbed(serverSetting: boolean) {
    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'variations')).thenReturn(of(true));
    when(context.select('product')).thenReturn(of({ type: 'VariationProduct' } as ProductView));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(ProductVariationDisplayComponent),
        MockComponent(ProductVariationSelectComponent),
        MockPipe(ServerSettingPipe, () => serverSetting),
        ProductItemVariationsComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  }

  describe('advanced variation handling', () => {
    beforeEach(async () => {
      prepareTestbed(true);
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductItemVariationsComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should render display for variation product in readOnly mode', () => {
      when(context.select('displayProperties', 'readOnly')).thenReturn(of(true));
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        Array [
          "ish-product-variation-display",
        ]
      `);
      expect(element?.textContent).toBeEmpty();
    });

    it('should render display for variation product', () => {
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        Array [
          "ish-product-variation-display",
        ]
      `);
      expect(element?.textContent).toBeEmpty();
    });

    it('should render variation count for variation product master', () => {
      when(context.select('product')).thenReturn(of({ type: 'VariationProductMaster' } as ProductView));
      when(context.select('variationCount')).thenReturn(of(1234));
      fixture.detectChanges();

      expect(element?.textContent).toContain('1234');
    });
  });

  describe('b2c variation handling', () => {
    beforeEach(async () => {
      prepareTestbed(false);
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductItemVariationsComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should render select for variation product', () => {
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
        Array [
          "ish-product-variation-select",
        ]
      `);
      expect(element?.textContent).toBeEmpty();
    });
  });
});
