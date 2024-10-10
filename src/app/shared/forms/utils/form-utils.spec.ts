import { FormControl, FormGroup, Validators } from '@angular/forms';

import { focusFirstInvalidField, markAsDirtyRecursive } from './form-utils';

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

  it('should focus on the first invalid field in a form', () => {
    const form = new FormGroup({
      field1: new FormControl('', Validators.required),
      field2: new FormControl('', Validators.required),
      field3: new FormControl(''),
    });

    const element1 = document.createElement('input');
    element1.id = 'formly_field1';
    document.body.appendChild(element1);

    const element2 = document.createElement('input');
    element2.id = 'formly_field2';
    document.body.appendChild(element2);

    const element3 = document.createElement('input');
    element3.id = 'formly_field3';
    document.body.appendChild(element3);

    form.controls.field1.markAsTouched();
    form.controls.field2.markAsTouched();

    focusFirstInvalidField(form);

    expect(document.activeElement).toBe(element1);
  });
});
