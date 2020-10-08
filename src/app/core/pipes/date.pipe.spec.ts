import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DatePipe } from './date.pipe';

describe('Date Pipe', () => {
  let datePipe: DatePipe;
  let translateService: TranslateService;

  beforeEach(() => {
    registerLocaleData(localeDe);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [DatePipe],
    });
    datePipe = TestBed.inject(DatePipe);

    translateService = TestBed.inject(TranslateService);
    translateService.setDefaultLang('en');
  });

  it('should be created', () => {
    expect(datePipe).toBeTruthy();
  });

  describe.each`
    date                           | format          | EN                | DE
    ${undefined}                   | ${undefined}    | ${'undefined'}    | ${'undefined'}
    ${1000}                        | ${undefined}    | ${'Jan 1, 1970'}  | ${'01.01.1970'}
    ${new Date(1000)}              | ${'shortDate'}  | ${'1/1/70'}       | ${'01.01.70'}
    ${'1971-01-01T00:00:01+00:00'} | ${'mediumTime'} | ${'12:00:01 AM'}  | ${'00:00:01'}
    ${32452435234}                 | ${undefined}    | ${'Jan 11, 1971'} | ${'11.01.1971'}
    ${new Date(32452435234)}       | ${'shortDate'}  | ${'1/11/71'}      | ${'11.01.71'}
    ${'1971-01-11T14:33:55+00:00'} | ${'mediumTime'} | ${'2:33:55 PM'}   | ${'14:33:55'}
  `('should transform $date to ', ({ date, format, EN, DE }) => {
    test(`${EN} with format ${format} for english local`, () => {
      translateService.use('en');
      expect(datePipe.transform(date, format)).toEqual(EN);
    });
    test(`${DE} with format ${format} for german locale`, () => {
      translateService.use('de');
      expect(datePipe.transform(date, format)).toEqual(DE);
    });
  });
});
