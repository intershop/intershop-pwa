import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { format, parse } from 'date-fns';
import { Observable, map } from 'rxjs';

export class DateHelper {
  // format string for internal date representation, refer to https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
  static readonly internalFormatString = 'yyyy-MM-dd';

  static addDays(date: Date, days: number) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  }

  static isSaturday(date: string | NgbDateStruct): boolean {
    if (!date) {
      return false;
    }
    let givenDate: Date;
    if (typeof date === 'string') {
      givenDate = DateHelper.fromStringToESDate(date);
    } else {
      givenDate = DateHelper.fromNgbDateStructToESDate(date);
    }

    return givenDate ? givenDate.getDay() === 6 : false;
  }

  static isSunday(date: string | NgbDateStruct): boolean {
    if (!date) {
      return false;
    }
    let givenDate: Date;
    if (typeof date === 'string') {
      givenDate = DateHelper.fromStringToESDate(date);
    } else {
      givenDate = DateHelper.fromNgbDateStructToESDate(date);
    }
    return givenDate ? givenDate.getDay() === 0 : false;
  }

  static addDaysToToday$(days$: Observable<number | undefined>): Observable<NgbDateStruct | undefined> {
    const today = new Date();
    return days$.pipe(map(daysLoc => DateHelper.addDaysToGivenDate(daysLoc, today)));
  }

  static addDaysToGivenDate(days: number | undefined, givenDate: Date): NgbDateStruct | undefined {
    if (days === undefined) {
      return;
    }
    const minDate = DateHelper.addDays(givenDate, days);
    return {
      year: minDate.getFullYear(),
      month: minDate.getMonth() + 1,
      day: minDate.getDate(),
    };
  }

  static fromStringToNgbDateStructFormatted(
    value: string | undefined,
    formatString: string
  ): NgbDateStruct | undefined {
    let date;
    try {
      date = parse(value, formatString, new Date());
    } catch (err) {
      return;
    }
    return DateHelper.fromESDateToNgbDateStruct(date);
  }

  static fromNgbDateStructToStringFormatted(date: NgbDateStruct | undefined, formatString: string): string {
    return date ? format(DateHelper.fromNgbDateStructToESDate(date), formatString) : '';
  }

  private static fromStringToESDate(value: string | undefined, formatString?: string): Date {
    let date;
    try {
      date = parse(value, formatString ?? DateHelper.internalFormatString, new Date());
    } catch (err) {
      return;
    }
    return date;
  }

  // important note: the ES Date object has 0-indexed months, while NgbDateStruct has 1-indexed months
  private static fromNgbDateStructToESDate(date: NgbDateStruct): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  // important note: the ES Date object has 0-indexed months, while NgbDateStruct has 1-indexed months
  private static fromESDateToNgbDateStruct(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
}
