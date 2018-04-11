import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as using from 'jasmine-data-provider';
import { AVAILABLE_LOCALES } from '../../core/configurations/injection-keys';
import { coreReducers } from '../../core/store/core.system';
import { CoreState } from '../../core/store/countries';
import { SelectLocale, SetAvailableLocales } from '../../core/store/locale';
import { Locale } from '../locale/locale.model';
import { AttributeToStringPipe } from './attribute.pipe';

describe('Attribute toString Pipe', () => {
  let pipe: AttributeToStringPipe;
  let store$: Store<CoreState>;

  let EN_US: Locale;
  let DE_DE: Locale;

  const valuesSeparator = '::';

  beforeEach(() => {
    registerLocaleData(localeDe);

    TestBed.configureTestingModule({
      imports: [CommonModule, StoreModule.forRoot(coreReducers)],
      providers: [AttributeToStringPipe, CurrencyPipe, DatePipe, DecimalPipe],
    });
    pipe = TestBed.get(AttributeToStringPipe);
    store$ = TestBed.get(Store);
    const locales: Locale[] = TestBed.get(AVAILABLE_LOCALES);
    store$.dispatch(new SetAvailableLocales(locales));

    EN_US = locales.find(v => v.lang.startsWith('en'));
    DE_DE = locales.find(v => v.lang.startsWith('de'));
  });

  function dataProvider() {
    return [
      {
        attribute: {
          name: 'StringAttribute',
          type: 'String',
          value: '1920 x 1080, 1600 x 1200, 640 x 480',
        },
        en_US: '1920 x 1080, 1600 x 1200, 640 x 480',
        de_DE: '1920 x 1080, 1600 x 1200, 640 x 480',
      },
      {
        attribute: {
          name: 'DateAttribute',
          type: 'Date',
          value: 1521457386000,
        },
        en_US: '3/19/18',
        de_DE: '19.03.18',
      },
      {
        attribute: {
          name: 'IntegerAttribute',
          type: 'Integer',
          value: 1234,
        },
        en_US: '1,234',
        de_DE: '1.234',
      },
      {
        attribute: {
          name: 'DoubleAttribute',
          type: 'Double',
          value: 123.12,
        },
        en_US: '123.12',
        de_DE: '123,12',
      },
      {
        attribute: {
          name: 'LongAttribute',
          type: 'Long',
          value: 123456789,
        },
        en_US: '123,456,789',
        de_DE: '123.456.789',
      },
      {
        attribute: {
          name: 'BigDecimalAttribute',
          type: 'BigDecimal',
          value: 12345.6789,
        },
        en_US: '12,345.679',
        de_DE: '12.345,679',
      },
      {
        attribute: {
          name: 'BooleanAttribute',
          type: 'Boolean',
          value: true,
        },
        en_US: 'true',
        de_DE: 'true',
      },
      {
        attribute: {
          name: 'QuantityAttribute',
          type: 'ResourceAttribute',
          value: {
            type: 'Quantity',
            value: 1234,
            unit: 'mm',
          },
        },
        en_US: '1,234\xA0mm',
        de_DE: '1.234\xA0mm',
      },
      {
        attribute: {
          name: 'MoneyAttribute',
          type: 'ResourceAttribute',
          value: {
            type: 'Money',
            value: 391.98,
            currencyMnemonic: 'USD',
          },
        },
        en_US: '$391.98',
        de_DE: '391,98\xA0$',
      },
      {
        attribute: {
          name: 'UnsupportedAttribute',
          type: 'Unsupported',
          value: 'SomeValue',
        },
        en_US: 'SomeValue',
        de_DE: 'SomeValue',
      },
      {
        attribute: {
          name: 'MultipleStringAttribute',
          type: 'MultipleString',
          value: ['hallo', 'welt'],
        },
        en_US: `hallo${valuesSeparator}welt`,
        de_DE: `hallo${valuesSeparator}welt`,
      },
      {
        attribute: {
          name: 'MultipleIntegerAttribute',
          type: 'MultipleInteger',
          value: [12345, 2345],
        },
        en_US: `12,345${valuesSeparator}2,345`,
        de_DE: `12.345${valuesSeparator}2.345`,
      },
      {
        attribute: {
          name: 'MultipleDoubleAttribute',
          type: 'MultipleDouble',
          value: [1234.5, 234.5],
        },
        en_US: `1,234.5${valuesSeparator}234.5`,
        de_DE: `1.234,5${valuesSeparator}234,5`,
      },
      {
        attribute: {
          name: 'MultipleLongAttribute',
          type: 'MultipleLong',
          value: [123456789, 123456789],
        },
        en_US: `123,456,789${valuesSeparator}123,456,789`,
        de_DE: `123.456.789${valuesSeparator}123.456.789`,
      },
      {
        attribute: {
          name: 'MultipleBigDecimalAttribute',
          type: 'MultipleBigDecimal',
          value: [12.3456789, 12345.6789],
        },
        en_US: `12.346${valuesSeparator}12,345.679`,
        de_DE: `12,346${valuesSeparator}12.345,679`,
      },
      {
        attribute: {
          name: 'MultipleBooleanAttribute',
          type: 'MultipleBoolean',
          value: [true, false],
        },
        en_US: `true${valuesSeparator}false`,
        de_DE: `true${valuesSeparator}false`,
      },
      {
        attribute: {
          name: 'MultipleDateAttribute',
          type: 'MultipleDate',
          value: [1355270400000, 1349827200000],
        },
        en_US: `12/12/12${valuesSeparator}10/10/12`,
        de_DE: `12.12.12${valuesSeparator}10.10.12`,
      },
    ];
  }

  using(dataProvider, slice => {
    it(`should translate attribute of type ${slice.attribute.type} correcly when locale en_US is set`, () => {
      store$.dispatch(new SelectLocale(EN_US));
      expect(pipe.transform(slice.attribute, valuesSeparator)).toEqual(slice.en_US);
    });

    it(`should translate attribute of type ${slice.attribute.type} correcly when locale de_DE is set`, () => {
      store$.dispatch(new SelectLocale(DE_DE));
      expect(pipe.transform(slice.attribute, valuesSeparator)).toEqual(slice.de_DE);
    });
  });
});
