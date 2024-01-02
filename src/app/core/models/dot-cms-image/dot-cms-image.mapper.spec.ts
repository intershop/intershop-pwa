import { TestBed } from '@angular/core/testing';

import { DotCmsImageData } from './dot-cms-image.interface';
import { DotCmsImageMapper } from './dot-cms-image.mapper';

describe('DotCmsImage Mapper', () => {
  let dotCmsImageMapper: DotCmsImageMapper;

  beforeEach(() => {
    dotCmsImageMapper = TestBed.inject(DotCmsImageMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => dotCmsImageMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: DotCmsImageData = {
        incomingField: 'test',
        otherField: false,
      };
      const mapped = dotCmsImageMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).not.toHaveProperty('otherField');
    });
  });
});
