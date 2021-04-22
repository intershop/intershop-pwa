import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

import { Address } from 'ish-core/models/address/address.model';

import { determineSalutations, getAddressOptions, markAsDirtyRecursive } from './form-utils';

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

  describe('getAddressOptions', () => {
    it('should return address options if addresses are given', done => {
      getAddressOptions(
        of([
          { id: '12345', firstName: 'Patricia', lastName: 'Miller', addressLine1: 'Potsdamer Str.', city: 'Berlin' },
          { id: '67890', firstName: 'Bernhard', lastName: 'Boldner', addressLine1: 'Berliner Str.', city: 'Hamburg' },
        ] as Address[])
      ).subscribe(options => {
        expect(options).toMatchInlineSnapshot(`
          Array [
            Object {
              "label": "Patricia Miller, Potsdamer Str., Berlin",
              "value": "12345",
            },
            Object {
              "label": "Bernhard Boldner, Berliner Str., Hamburg",
              "value": "67890",
            },
          ]
        `);
        done();
      });
    });
  });
});
