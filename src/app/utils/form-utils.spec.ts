import { FormControl, FormGroup } from '@angular/forms';
import { arrayDiff, arrayIntersect, markAsDirtyRecursive } from './form-utils';

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
        ctrl: new FormControl('')
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
            ctrlB: new FormControl('')
          })
        })
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
});
