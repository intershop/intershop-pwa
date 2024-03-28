import { TestBed } from '@angular/core/testing';

import { HtmlEncodePipe } from './html-encode.pipe';

describe('Html Encode Pipe', () => {
  let htmlEncodePipe: HtmlEncodePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HtmlEncodePipe],
    });
    htmlEncodePipe = TestBed.inject(HtmlEncodePipe);
  });

  it('should be created', () => {
    expect(htmlEncodePipe).toBeTruthy();
  });

  it.each([
    ['<img src=https://test.jpg>', '&lt;img src=https://test.jpg&gt;'],
    ['?hello&world', '?hello&amp;world'],
  ])(`should transform '%s' to '%s'`, (input, output) => {
    expect(htmlEncodePipe.transform(input)).toEqual(output);
  });
});
