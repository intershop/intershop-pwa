import { TestBed } from '@angular/core/testing';

import { HighlightPipe } from './highlight.pipe';

describe('Highlight Pipe', () => {
  let pipe: HighlightPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HighlightPipe],
    });
    pipe = TestBed.inject(HighlightPipe);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it.each([
    [undefined, undefined, undefined],
    ['Lorem ipsum dolor sit amet', undefined, 'Lorem ipsum dolor sit amet'],
    ['Lorem ipsum dolor sit amet', 'ipsum', 'Lorem <span class="searchTerm">ipsum</span> dolor sit amet'],
    [
      'Lorem ipsum dolor sit amet',
      'Lorem ipsum dolor sit amet',
      '<span class="searchTerm">Lorem</span> <span class="searchTerm">ipsum</span> <span class="searchTerm">dolor</span> <span class="searchTerm">sit</span> <span class="searchTerm">amet</span>',
    ],
  ])(`should transform '%s' with '%s' to '%s'`, (text, search, expected) => {
    expect(pipe.transform(text, search)).toEqual(expected);
  });
});
