import { DotCmsImageHelper } from './dot-cms-image.helper';
import { DotCmsImage } from './dot-cms-image.model';

describe('DotCmsImage Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { id: 'test' } as DotCmsImage, undefined],
      [false, undefined, { id: 'test' } as DotCmsImage],
      [false, { id: 'test' } as DotCmsImage, { id: 'other' } as DotCmsImage],
      [true, { id: 'test' } as DotCmsImage, { id: 'test' } as DotCmsImage],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(DotCmsImageHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});
