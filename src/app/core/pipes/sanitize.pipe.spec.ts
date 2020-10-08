import { TestBed } from '@angular/core/testing';

import { SanitizePipe } from './sanitize.pipe';

describe('Sanitize Pipe', () => {
  let sanitizePipe: SanitizePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SanitizePipe],
    });
    sanitizePipe = TestBed.inject(SanitizePipe);
  });

  it('should be created', () => {
    expect(sanitizePipe).toBeTruthy();
  });

  it.each([
    ['', ''],
    [undefined, 'undefined'],
    ['(/&%/(%(&/%/&%/(&§!!', ''],
    ['Red', 'Red'],
    ['$ 25 - $ 50', '25_-_50'],
    ['    HELLO     ', 'HELLO'],
  ])(`should transform '%s' to '%s'`, (input, output) => {
    expect(sanitizePipe.transform(input)).toEqual(output);
  });
});
