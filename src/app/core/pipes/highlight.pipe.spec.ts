import { TestBed } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';

import { HighlightPipe } from './highlight.pipe';

describe('Highlight Pipe', () => {
  let pipe: HighlightPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HighlightPipe],
    });
    pipe = TestBed.get(HighlightPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  using(
    [
      { text: undefined, expected: undefined },
      { text: 'Lorem ipsum dolor sit amet', search: undefined, expected: 'Lorem ipsum dolor sit amet' },
      {
        text: 'Lorem ipsum dolor sit amet',
        search: 'ipsum',
        expected: 'Lorem <span class="searchTerm">ipsum</span> dolor sit amet',
      },
      {
        text: 'Lorem ipsum dolor sit amet',
        search: 'Lorem ipsum dolor sit amet',
        expected:
          '<span class="searchTerm">Lorem</span> <span class="searchTerm">ipsum</span> <span class="searchTerm">dolor</span> <span class="searchTerm">sit</span> <span class="searchTerm">amet</span>',
      },
    ],
    ({ text, search, expected }) => {
      it(`should transform "${text}" with "${search}" to "${expected}"`, () => {
        expect(pipe.transform(text, search)).toEqual(expected);
      });
    }
  );
});
