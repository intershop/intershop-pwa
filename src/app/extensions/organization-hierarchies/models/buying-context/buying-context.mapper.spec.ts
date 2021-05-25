import { TestBed } from '@angular/core/testing';

import { BuyingContextData } from './buying-context.interface';
import { BuyingContextMapper } from './buying-context.mapper';

describe('Buying Context Mapper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => BuyingContextMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: BuyingContextData = {
        groupId: 'Eng_Jena',
        groupName: 'Bio Tech Engineering Jena',
        organizationId: 'BioTech',
        groupPath: [
          { groupId: 'Eng_Jena', groupName: 'Bio Tech Engineering Jena' },
          { groupId: 'Jena', groupName: 'BioTech_Jena' },
        ],
      };
      const mapped = BuyingContextMapper.fromData(data);
      expect(mapped).toHaveProperty('groupId', 'Eng_Jena');
      expect(mapped).toHaveProperty('groupName', 'Bio Tech Engineering Jena');
      expect(mapped).toHaveProperty('organizationId', 'BioTech');
      expect(mapped).toHaveProperty('groupPath', [
        { groupId: 'Eng_Jena', groupName: 'Bio Tech Engineering Jena' },
        { groupId: 'Jena', groupName: 'BioTech_Jena' },
      ]);
    });
  });
});
