import { FormControl, FormGroup } from '@angular/forms';

import { markAsDirtyRecursive } from './form-utils';

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
});
