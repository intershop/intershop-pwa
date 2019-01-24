import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as using from 'jasmine-data-provider';

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
    datePipe = TestBed.get(DatePipe);

    translateService = TestBed.get(TranslateService);
    translateService.setDefaultLang('en');
  });

  it('should be created', () => {
    expect(datePipe).toBeTruthy();
  });

  using(
    [
      {
        date: undefined,
        format: undefined,
        EN: 'undefined',
        DE: 'undefined',
      },
      {
        date: 1000,
        format: undefined,
        EN: 'Jan 1, 1970',
        DE: '01.01.1970',
      },
      {
        date: new Date(1000),
        format: 'shortDate',
        EN: '1/1/70',
        DE: '01.01.70',
      },
      {
        date: '1971-01-01T00:00:01+00:00',
        format: 'mediumTime',
        EN: '12:00:01 AM',
        DE: '00:00:01',
      },
      {
        date: 32452435234,
        format: undefined,
        EN: 'Jan 11, 1971',
        DE: '11.01.1971',
      },
      {
        date: new Date(32452435234),
        format: 'shortDate',
        EN: '1/11/71',
        DE: '11.01.71',
      },
      {
        date: '1971-01-11T14:33:55+00:00',
        format: 'mediumTime',
        EN: '2:33:55 PM',
        DE: '14:33:55',
      },
    ],
    ({ date, format, EN, DE }) => {
      it(`should transform ${date} to ${EN} with format ${format} for english locale`, () => {
        translateService.use('en');
        expect(datePipe.transform(date, format)).toEqual(EN);
      });

      it(`should transform ${date} to ${DE} with format ${format} for german locale`, () => {
        translateService.use('de');
        expect(datePipe.transform(date, format)).toEqual(DE);
      });
    }
  );
});
