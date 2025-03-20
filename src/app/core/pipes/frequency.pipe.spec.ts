import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestBed } from '@angular/core/testing';
import { TranslateCompiler, TranslateModule, TranslateService } from '@ngx-translate/core';

import { PWATranslateCompiler } from 'ish-core/utils/translate/pwa-translate-compiler';

import { FrequencyPipe } from './frequency.pipe';

describe('Frequency Pipe', () => {
  let frequencyPipe: FrequencyPipe;
  let translateService: TranslateService;

  beforeEach(() => {
    registerLocaleData(localeDe);

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          compiler: { provide: TranslateCompiler, useClass: PWATranslateCompiler },
        }),
      ],
      providers: [FrequencyPipe],
    });
    frequencyPipe = TestBed.inject(FrequencyPipe);

    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
  });

  it('should be created', () => {
    expect(frequencyPipe).toBeTruthy();
  });

  describe.each`
    interval  | translationKey                      | translationValueEn                               | en           | translationValueDe                               | de
    ${'P21D'} | ${'order.recurrence.period.weeks'}  | ${'{{0, plural, one{# Week} other{# Weeks}}}'}   | ${'3 Weeks'} | ${'{{0, plural, one{# Woche} other{# Wochen}}}'} | ${'3 Wochen'}
    ${'P1M'}  | ${'order.recurrence.period.months'} | ${'{{0, plural, one{# Month} other{# Months}}}'} | ${'1 Month'} | ${'{{0, plural, one{# Monat} other{# Monate}}}'} | ${'1 Monat'}
    ${'P1Y'}  | ${'order.recurrence.period.years'}  | ${'{{0, plural, one{# Year} other{# Years}}}'}   | ${'1 Year'}  | ${'{{0, plural, one{# Jahr} other{# Jahre}}}'}   | ${'1 Jahr'}
    ${'P7D'}  | ${'order.recurrence.period.weeks'}  | ${'{{0, plural, one{# Week} other{# Weeks}}}'}   | ${'1 Week'}  | ${'{{0, plural, one{# Woche} other{# Wochen}}}'} | ${'1 Woche'}
  `('should transform $interval to', ({ interval, translationKey, translationValueEn, en, translationValueDe, de }) => {
    test(`${en} for english local`, () => {
      translateService.use('en');
      translateService.set(translationKey, translationValueEn);
      expect(frequencyPipe.transform(interval)).toEqual(en);
    });
    test(`${de} for german locale`, () => {
      translateService.use('de');
      translateService.set(translationKey, translationValueDe);
      expect(frequencyPipe.transform(interval)).toEqual(de);
    });
  });
});
