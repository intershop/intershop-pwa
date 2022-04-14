import { DateHelper } from './date-helper';

describe('Date Helper', () => {
  it('should add 4  days to current date', () => {
    const currentDay = new Date(2016, 11, 17, 0, 0, 0, 0);
    const result = new Date(2016, 11, 21, 0, 0, 0, 0);
    expect(DateHelper.addDays(currentDay, 4)).toEqual(result);
  });
});
