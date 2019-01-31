import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';

import { MakeHrefPipe } from './make-href.pipe';

describe('Make Href Pipe', () => {
  let makeHrefPipe: MakeHrefPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MakeHrefPipe],
    });
    makeHrefPipe = TestBed.get(MakeHrefPipe);
  });

  it('should be created', () => {
    expect(makeHrefPipe).toBeTruthy();
  });

  using(
    [
      { url: undefined, expected: 'undefined' },
      { url: '/test', params: undefined, expected: '/test' },
      { url: '/test', params: {}, expected: '/test' },
      { url: '/test', params: { foo: 'bar' }, expected: '/test;foo=bar' },
      { url: '/test', params: { foo: 'bar', marco: 'polo' }, expected: '/test;foo=bar;marco=polo' },
      { url: '/test?query=q', params: undefined, expected: '/test?query=q' },
      { url: '/test?query=q', params: {}, expected: '/test?query=q' },
      { url: '/test?query=q', params: { foo: 'bar' }, expected: '/test;foo=bar?query=q' },
      { url: '/test?query=q', params: { foo: 'bar', marco: 'polo' }, expected: '/test;foo=bar;marco=polo?query=q' },
    ],
    ({ url, params, expected }) => {
      it(`should transform "${url}" with ${JSON.stringify(params)} to "${expected}"`, () => {
        expect(makeHrefPipe.transform({ path: () => url } as Location, params)).toEqual(expected);
      });
    }
  );
});
