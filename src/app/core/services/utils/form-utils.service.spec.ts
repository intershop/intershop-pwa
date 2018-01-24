import { FormControl, FormGroup } from '@angular/forms';
import { FormUtilsService } from './form-utils.service';

describe('Form Utils Service', () => {
  let formUtils: FormUtilsService;

  beforeEach(() => {
    formUtils = new FormUtilsService();
  });

  describe('array utils', () => {
    it('should diff arrays', () => {
      const a = [1, 2, 3, 4, 5, 6];
      const b = [4, 5, 6, 7, 8, 9];
      const expected = [1, 2, 3];

      const result = formUtils.arrayDiff(a, b);
      expect(result).toEqual(expected);
    });

    it('should intersect arrays', () => {
      const a = [1, 2, 3, 4, 5, 6];
      const b = [4, 5, 6, 7, 8, 9];
      const expected = [4, 5, 6];

      const result = formUtils.arrayIntersect(a, b);
      expect(result).toEqual(expected);
    });
  });


  describe('markAsDirtyRecursive', () => {
    it('should mark flat form group dirty', () => {
      const group = new FormGroup({
        ctrl: new FormControl('')
      });

      const ctrl = group.get('ctrl');
      expect(ctrl.dirty).toBeFalsy();
      formUtils.markAsDirtyRecursive(group);
      expect(ctrl.dirty).toBeTruthy();
    });

    it('should mark nested form group dirty', () => {
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

      formUtils.markAsDirtyRecursive(group);

      expect(ctrlA.dirty).toBeTruthy();
      expect(ctrlB.dirty).toBeTruthy();
    });
  });
});
