import { FormControl, FormGroup } from '@angular/forms';

import {
  arrayDiff,
  arrayIntersect,
  determineSalutations,
  markAsDirtyRecursive,
  markFormControlsAsInvalid,
} from './form-utils';

describe('Form Utils', () => {
  describe('array utils', () => {
    it('should return diff for two arrays', () => {
      const a = [1, 2, 3, 4, 5, 6];
      const b = [4, 5, 6, 7, 8, 9];
      const expected = [1, 2, 3];

      const result = arrayDiff(a, b);
      expect(result).toEqual(expected);
    });

    it('should return intersection for two arrays', () => {
      const a = [1, 2, 3, 4, 5, 6];
      const b = [4, 5, 6, 7, 8, 9];
      const expected = [4, 5, 6];

      const result = arrayIntersect(a, b);
      expect(result).toEqual(expected);
    });
  });

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

  describe('markFormControlsAsInvalid', () => {
    it('should mark a single field as dirty when set', () => {
      const form = new FormGroup({
        a: new FormControl(),
        b: new FormControl(),
        c: new FormControl(),
      });
      const fields = ['a'];
      markFormControlsAsInvalid(form, fields);
      expect(form.get('a').valid).toBeFalse();
      expect(form.get('b').valid).toBeTrue();
      expect(form.get('c').valid).toBeTrue();
    });

    it('should mark multiple fields as dirty when comma separated', () => {
      const form = new FormGroup({
        a: new FormControl(),
        b: new FormControl(),
        c: new FormControl(),
      });
      const fields = ['a', 'b'];
      markFormControlsAsInvalid(form, fields);
      expect(form.get('a').valid).toBeFalse();
      expect(form.get('b').valid).toBeFalse();
      expect(form.get('c').valid).toBeTrue();
    });

    it('should mark fully specified fields as dirty when comma separated', () => {
      const form = new FormGroup({
        a: new FormGroup({
          a1: new FormControl(),
          a2: new FormControl(),
        }),
        b: new FormControl(),
        c: new FormControl(),
      });
      const fields = ['a.a1'];
      markFormControlsAsInvalid(form, fields);
      expect(form.get('a').get('a1').valid).toBeFalse();
      expect(form.get('a').get('a2').valid).toBeTrue();
      expect(form.get('b').valid).toBeTrue();
      expect(form.get('c').valid).toBeTrue();
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

    it('should return salutations if countryCode is DE', () => {
      expect(determineSalutations('DE')).toHaveLength(3);
    });

    it('should return salutations if countryCode is FR', () => {
      expect(determineSalutations('FR')).toHaveLength(3);
    });
  });
});
