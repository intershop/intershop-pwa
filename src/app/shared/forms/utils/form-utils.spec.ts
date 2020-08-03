import { FormControl, FormGroup } from '@angular/forms';

import { determineSalutations, markAsDirtyRecursive } from './form-utils';

describe('Form Utils', () => {
  describe('markAsDirtyRecursive', () => {
    it('should mark all controls dirty for flat form group', () => {
      const group = new FormGroup({
        ctrl: new FormControl(''),
      });

      const ctrl = group.get('ctrl');
      expect(ctrl.dirty).toBeFalsy();
      markAsDirtyRecursive(group);
      expect(ctrl.dirty).toBeTruthy();
    });

    it('should mark all controls dirty for nested form group', () => {
      const group = new FormGroup({
        foo: new FormGroup({
          ctrlA: new FormControl(''),
          grp: new FormGroup({
            ctrlB: new FormControl(''),
          }),
        }),
      });

      const ctrlA = group.get('foo.ctrlA');
      const ctrlB = group.get('foo.grp.ctrlB');

      expect(ctrlA.dirty).toBeFalsy();
      expect(ctrlB.dirty).toBeFalsy();

      markAsDirtyRecursive(group);

      expect(ctrlA.dirty).toBeTruthy();
      expect(ctrlB.dirty).toBeTruthy();
    });
  });

  describe('determineSalutations', () => {
    it('should return an empty array if countryCode is empty', () => {
      expect(determineSalutations('')).toBeEmpty();
    });

    it('should return an empty array if countryCode is not known', () => {
      expect(determineSalutations('BG')).toBeEmpty();
    });

    it('should return salutations if countryCode is GB', () => {
      expect(determineSalutations('GB')).toHaveLength(5);
    });

    it('should return salutations if countryCode is US', () => {
      expect(determineSalutations('US')).toHaveLength(3);
    });

    it('should return salutations if countryCode is DE', () => {
      expect(determineSalutations('DE')).toHaveLength(3);
    });

    it('should return salutations if countryCode is FR', () => {
      expect(determineSalutations('FR')).toHaveLength(3);
    });
  });
});
