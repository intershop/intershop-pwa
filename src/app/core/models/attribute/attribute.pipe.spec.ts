import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AttributeToStringPipe } from './attribute.pipe';

describe('Attribute Pipe', () => {
  let pipe: AttributeToStringPipe;
  let translateService: TranslateService;

  const valuesSeparator = '::';

  beforeEach(() => {
    registerLocaleData(localeDe);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [AttributeToStringPipe],
    });
    pipe = TestBed.inject(AttributeToStringPipe);
    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
  });

  describe.each`
    attribute                                                                                                          | en_US                                         | de_DE
    ${{ name: 'StringAttribute', type: 'String', value: '1920 x 1080, 1600 x 1200, 640 x 480' }}                       | ${'1920 x 1080, 1600 x 1200, 640 x 480'}      | ${'1920 x 1080, 1600 x 1200, 640 x 480'}
    ${{ name: 'DateAttribute', type: 'Date', value: 1521457386000 }}                                                   | ${'3/19/18'}                                  | ${'19.03.18'}
    ${{ name: 'IntegerAttribute', type: 'Integer', value: 1234 }}                                                      | ${'1,234'}                                    | ${'1.234'}
    ${{ name: 'DoubleAttribute', type: 'Double', value: 123.12 }}                                                      | ${'123.12'}                                   | ${'123,12'}
    ${{ name: 'LongAttribute', type: 'Long', value: 123456789 }}                                                       | ${'123,456,789'}                              | ${'123.456.789'}
    ${{ name: 'BigDecimalAttribute', type: 'BigDecimal', value: 12345.6789 }}                                          | ${'12,345.679'}                               | ${'12.345,679'}
    ${{ name: 'BooleanAttribute', type: 'Boolean', value: true }}                                                      | ${'true'}                                     | ${'true'}
    ${{ name: 'QuantityAttribute', type: 'ResourceAttribute', value: { type: 'Quantity', value: 1234, unit: 'mm' } }}  | ${'1,234\xA0mm'}                              | ${'1.234\xA0mm'}
    ${{ name: 'MoneyAttribute', type: 'ResourceAttribute', value: { type: 'Money', value: 391.98, currency: 'USD' } }} | ${'$391.98'}                                  | ${'391,98\xA0$'}
    ${{ name: 'UnsupportedAttribute', type: 'Unsupported', value: 'SomeValue' }}                                       | ${'SomeValue'}                                | ${'SomeValue'}
    ${{ name: 'MultipleStringAttribute', type: 'MultipleString', value: ['hallo', 'welt'] }}                           | ${`hallo${valuesSeparator}welt`}              | ${`hallo${valuesSeparator}welt`}
    ${{ name: 'MultipleIntegerAttribute', type: 'MultipleInteger', value: [12345, 2345] }}                             | ${`12,345${valuesSeparator}2,345`}            | ${`12.345${valuesSeparator}2.345`}
    ${{ name: 'MultipleDoubleAttribute', type: 'MultipleDouble', value: [1234.5, 234.5] }}                             | ${`1,234.5${valuesSeparator}234.5`}           | ${`1.234,5${valuesSeparator}234,5`}
    ${{ name: 'MultipleLongAttribute', type: 'MultipleLong', value: [123456789, 123456789] }}                          | ${`123,456,789${valuesSeparator}123,456,789`} | ${`123.456.789${valuesSeparator}123.456.789`}
    ${{ name: 'MultipleBigDecimalAttribute', type: 'MultipleBigDecimal', value: [12.3456789, 12345.6789] }}            | ${`12.346${valuesSeparator}12,345.679`}       | ${`12,346${valuesSeparator}12.345,679`}
    ${{ name: 'MultipleBooleanAttribute', type: 'MultipleBoolean', value: [true, false] }}                             | ${`true${valuesSeparator}false`}              | ${`true${valuesSeparator}false`}
    ${{ name: 'MultipleDateAttribute', type: 'MultipleDate', value: [1355270400000, 1349827200000] }}                  | ${`12/12/12${valuesSeparator}10/10/12`}       | ${`12.12.12${valuesSeparator}10.10.12`}
  `('should translate attribute of type $attribute.type correctly when locale ', ({ attribute, en_US, de_DE }) => {
    // tslint:disable-next-line:meaningful-naming-in-tests
    it(`en_US is set`, () => {
      translateService.use('en_US');
      expect(pipe.transform(attribute, valuesSeparator)).toEqual(en_US);
    });
    // tslint:disable-next-line:meaningful-naming-in-tests
    it(`de_DE is set`, () => {
      translateService.use('de_DE');
      expect(pipe.transform(attribute, valuesSeparator)).toEqual(de_DE);
    });
  });
});
