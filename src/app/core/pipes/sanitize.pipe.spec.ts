import { TestBed } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';

import { SanitizePipe } from './sanitize.pipe';

describe('Sanitize Pipe', () => {
  let sanitizePipe: SanitizePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SanitizePipe],
    });
    sanitizePipe = TestBed.get(SanitizePipe);
  });

  it('should be created', () => {
    expect(sanitizePipe).toBeTruthy();
  });

  using(
    [
      { input: '', output: '' },
      { input: undefined, output: 'undefined' },
      { input: '(/&%/(%(&/%/&%/(&§!!', output: '' },
      { input: 'Red', output: 'Red' },
      { input: '$ 25 - $ 50', output: '25_-_50' },
      { input: '    HELLO     ', output: 'HELLO' },
    ],
    ({ input, output }) => {
      it(`should transform '${input}' to '${output}'`, () => {
        expect(sanitizePipe.transform(input)).toEqual(output);
      });
    }
  );
});
