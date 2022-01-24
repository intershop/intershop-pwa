import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';

import { ProductMasterLinkComponent } from '../product-master-link/product-master-link.component';

import { ProductDetailVariationsComponent } from './product-detail-variations.component';

describe('Product Detail Variations Component', () => {
  let component: ProductDetailVariationsComponent;
  let fixture: ComponentFixture<ProductDetailVariationsComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  async function prepareTestbed(serverSetting: boolean) {
    context = mock(ProductContextFacade);

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ProductMasterLinkComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockComponent(ProductVariationSelectComponent),
        MockPipe(ServerSettingPipe, () => serverSetting),
        ProductDetailVariationsComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  }

  describe('b2c variation handling', () => {
    beforeEach(async () => {
      prepareTestbed(false);
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductDetailVariationsComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should not render if display is false', () => {
      fixture.detectChanges();

      expect(element).toMatchInlineSnapshot(`N/A`);
    });

    it('should always render select by default', () => {
      when(context.select('displayProperties', 'variations')).thenReturn(of(true));
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-variation-select",
      ]
    `);
    });
  });

  describe('advanced variation handling', () => {
    beforeEach(async () => {
      prepareTestbed(true);
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ProductDetailVariationsComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should always render display for advanced variation handling', () => {
      when(context.select('displayProperties', 'variations')).thenReturn(of(true));
      fixture.detectChanges();

      expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-variation-display",
        "ish-product-master-link",
      ]
    `);
    });
  });
});
