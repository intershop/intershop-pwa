import { CommonModule, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as using from 'jasmine-data-provider';
import { PricePipe } from './price.pipe';

describe('Price toString Pipe', () => {
  let pipe: PricePipe;
  let translateService: TranslateService;

  beforeEach(() => {
    registerLocaleData(localeDe);

    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot()],
      providers: [PricePipe],
    });
    pipe = TestBed.get(PricePipe);
    translateService = TestBed.get(TranslateService);
    translateService.setDefaultLang('en');
  });

  function dataProvider() {
    return [
      {
        price: {
          type: 'Money',
          value: 391.98,
          currencyMnemonic: 'USD',
        },
        en_US: '$391.98',
        de_DE: '391,98\xA0$',
      },
      {
        price: {
          type: 'ProductPrice',
          value: 391.99,
          currencyMnemonic: 'EUR',
        },
        en_US: '€391.99',
        de_DE: '391,99\xA0€',
      },
    ];
  }

  using(dataProvider, slice => {
    it(`should translate price of type ${slice.price.type} correcly when locale en_US is set`, () => {
      translateService.use('en_US');
      expect(pipe.transform(slice.price)).toEqual(slice.en_US);
    });

    it(`should translate price of type ${slice.price.type} correcly when locale de_DE is set`, () => {
      translateService.use('de_DE');
      expect(pipe.transform(slice.price)).toEqual(slice.de_DE);
    });
  });
});
