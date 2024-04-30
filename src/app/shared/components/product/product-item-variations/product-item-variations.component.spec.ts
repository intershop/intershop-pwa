import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateCompiler, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject, map } from 'rxjs';
import { anyString, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { findAllElements } from 'ish-core/utils/dev/html-query-utils';
import { PWATranslateCompiler } from 'ish-core/utils/translate/pwa-translate-compiler';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';

import { ProductItemVariationsComponent } from './product-item-variations.component';

describe('Product Item Variations Component', () => {
  let component: ProductItemVariationsComponent;
  let fixture: ComponentFixture<ProductItemVariationsComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;
  let translate: TranslateService;

  const readOnly$ = new BehaviorSubject<boolean>(false);
  const visible$ = new BehaviorSubject<boolean>(true);
  const advancedVariationHandling$ = new BehaviorSubject<boolean>(true);
  const productType$ = new BehaviorSubject<'VariationProduct' | 'VariationProductMaster' | 'Product'>(
    'VariationProduct'
  );
  const variationCount$ = new BehaviorSubject<number>(25);

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'variations')).thenReturn(visible$);
    when(context.select('displayProperties', 'readOnly')).thenReturn(readOnly$);
    when(context.select('product')).thenReturn(productType$.pipe(map(type => ({ type } as ProductView))));
    when(context.select('variationCount')).thenReturn(variationCount$);

    const appFacade = mock(AppFacade);
    when(appFacade.serverSetting$(anyString())).thenReturn(advancedVariationHandling$);

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          compiler: { provide: TranslateCompiler, useClass: PWATranslateCompiler },
        }),
      ],
      declarations: [
        MockComponent(ProductVariationDisplayComponent),
        MockComponent(ProductVariationSelectComponent),
        ProductItemVariationsComponent,
      ],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemVariationsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    translate = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display variation count for masters', () => {
    productType$.next('VariationProductMaster');
    readOnly$.next(true);
    visible$.next(true);
    advancedVariationHandling$.next(true);
    variationCount$.next(25);

    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('product.variations.text', '{{ 0, plural, =1{one model} other{# models} }}');

    fixture.detectChanges();

    expect(findAllElements(element)).toEqual(['span']);
    expect(element.textContent).toMatchInlineSnapshot(`"25 models"`);

    variationCount$.next(1);
    fixture.detectChanges();

    expect(element.textContent).toMatchInlineSnapshot(`"one model"`);
  });

  describe.each`
    advancedVariationHandling | productType                 | readOnly | expectedElements
    ${true}                   | ${'VariationProduct'}       | ${false} | ${['div', 'ish-product-variation-display']}
    ${true}                   | ${'VariationProduct'}       | ${true}  | ${['div', 'ish-product-variation-display']}
    ${true}                   | ${'VariationProductMaster'} | ${false} | ${['span']}
    ${true}                   | ${'VariationProductMaster'} | ${true}  | ${['span']}
    ${true}                   | ${'Product'}                | ${false} | ${[]}
    ${true}                   | ${'Product'}                | ${true}  | ${[]}
    ${false}                  | ${'VariationProduct'}       | ${false} | ${['div', 'ish-product-variation-select']}
    ${false}                  | ${'VariationProduct'}       | ${true}  | ${['div', 'ish-product-variation-display']}
    ${false}                  | ${'VariationProductMaster'} | ${false} | ${['span']}
    ${false}                  | ${'VariationProductMaster'} | ${true}  | ${['span']}
    ${false}                  | ${'Product'}                | ${false} | ${[]}
    ${false}                  | ${'Product'}                | ${true}  | ${[]}
  `(
    `with advancedVariationHandling=$advancedVariationHandling, productType=$productType, readOnly=$readOnly`,
    ({ advancedVariationHandling, productType, readOnly, expectedElements }) => {
      beforeEach(() => {
        advancedVariationHandling$.next(advancedVariationHandling);
        productType$.next(productType);
        readOnly$.next(readOnly);
        visible$.next(true);
        fixture.detectChanges();
      });

      it(`should ${expectedElements?.length ? `display ${expectedElements.join()}` : 'not display anything'}`, () => {
        expect(findAllElements(element)).toEqual(expectedElements);
      });

      it('should not display anything if variations are not visible', () => {
        visible$.next(false);
        fixture.detectChanges();
        expect(findAllElements(element)).toBeEmpty();
      });
    }
  );
});
