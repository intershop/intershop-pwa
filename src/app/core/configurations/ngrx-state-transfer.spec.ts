import { TransferState } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { EMPTY } from 'rxjs';

import { NGRX_STATE_SK, filterState, ngrxStateTransfer } from './ngrx-state-transfer';

describe('Ngrx State Transfer', () => {
  describe('ngrxStateTransfer', () => {
    it('should not transfer the router state from the server to the browser', () => {
      TestBed.configureTestingModule({
        providers: [
          provideMockActions(EMPTY),
          provideMockStore({
            initialState: { configuration: { lang: 'en_US' }, router: { state: { url: '/error' } } },
          }),
        ],
      });
      const transferState = TestBed.inject(TransferState);

      ngrxStateTransfer(transferState, TestBed.inject(Store), TestBed.inject(Actions))();

      expect(JSON.parse(transferState.toJson())[NGRX_STATE_SK]).toEqual({ configuration: { lang: 'en_US' } });
    });
  });

  describe('filterState', () => {
    it('should omit keys starting with underscore when copying state (simple)', () => {
      const input = {
        a: 'A',
        _b: 'B',
        c: 'C',
        _d: 'D',
      };

      const output = {
        a: 'A',
        c: 'C',
      };

      expect(filterState(input, 2)).toEqual(output);
    });

    it('should omit keys starting with underscore when copying state (advanced)', () => {
      const input = {
        a: 'A',
        b: {
          _x: 'X',
          y: 'Y',
        },
      };

      const output = {
        a: 'A',
        b: {
          y: 'Y',
        },
      };

      expect(filterState(input, 2)).toEqual(output);
    });

    it('should omit keys starting with underscore for the first two levels when copying state (complex)', () => {
      const input = {
        a: 'A',
        _b: 'B',
        c: {
          x: 'X',
          _y: {
            a: 'A',
            b: 'B',
          },
          z: {
            a: ['A'],
            _b: 'B',
          },
        },
      };

      const output = {
        a: 'A',
        c: {
          x: 'X',
          z: {
            a: ['A'],
            _b: 'B',
          },
        },
      };

      expect(filterState(input, 2)).toEqual(output);
    });

    it('should be able to handle empty states', () => {
      expect(filterState({}, 2)).toBeEmpty();
    });

    it('should be able to handle undefined values', () => {
      const input: object = {
        a: undefined,
        b: {
          _x: undefined,
          y: 'Y',
        },
      };

      const output: object = {
        a: undefined,
        b: {
          y: 'Y',
        },
      };

      expect(filterState(input, 2)).toEqual(output);
    });

    it('should be able to handle array values', () => {
      const input: object = {
        a: [],
        b: {
          _x: [],
          y: ['Y'],
        },
      };

      const output: object = {
        a: [],
        b: {
          y: ['Y'],
        },
      };

      expect(filterState(input, 2)).toEqual(output);
    });
  });
});
