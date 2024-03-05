import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';

import { VariationAttributePipe } from './variation-attribute.pipe';

describe('Variation Attribute Pipe', () => {
  let variationAttributePipe: VariationAttributePipe;
  let translateService: TranslateService;

  beforeEach(() => {
    registerLocaleData(localeDe);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [VariationAttributePipe],
    });

    variationAttributePipe = TestBed.inject(VariationAttributePipe);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
    translateService.use('en');
  });

  it('should be created', () => {
    expect(variationAttributePipe).toBeTruthy();
  });

  it('should transform undefined to undefined', () => {
    expect(variationAttributePipe.transform(undefined)).toMatchInlineSnapshot(`"undefined"`);
  });

  it('should transform string attribute to string', () => {
    const attr = { value: 'test' } as VariationAttribute;
    expect(variationAttributePipe.transform(attr)).toMatchInlineSnapshot(`"test"`);
  });

  it('should transform number attribute to number', () => {
    const attr = { value: 123 } as VariationAttribute;
    expect(variationAttributePipe.transform(attr)).toMatchInlineSnapshot(`"123"`);
  });

  it('should transform float attribute to formatted locale en', () => {
    const attr = { value: 123.4 } as VariationAttribute;
    expect(variationAttributePipe.transform(attr)).toMatchInlineSnapshot(`"123.4"`);
  });

  it('should transform float attribute to formatted locale de', () => {
    translateService.use('de');
    const attr = { value: 123.4 } as VariationAttribute;
    expect(variationAttributePipe.transform(attr)).toMatchInlineSnapshot(`"123,4"`);
  });

  it('should transform object attribute to formatted locale en', () => {
    const attr = { value: { value: 123.4, unit: 'mm' } } as VariationAttribute;
    expect(variationAttributePipe.transform(attr)).toMatchInlineSnapshot(`"123.4\xA0mm"`);
  });

  it('should transform object attribute to formatted locale de', () => {
    translateService.use('de');
    const attr = { value: { value: 123.4, unit: 'mm' } } as VariationAttribute;
    expect(variationAttributePipe.transform(attr)).toMatchInlineSnapshot(`"123,4\xA0mm"`);
  });
});
