import { createAction, createReducer } from '@ngrx/store';
import { noop } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { makeHttpError } from './dev/api-service-utils';
import { httpError, payload, setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from './ngrx-creators';

describe('Ngrx Creators', () => {
  const load = createAction('[Test] Load');
  const loadSuccess = createAction('[Test API] Load Success', payload<{ entities: unknown[] }>());
  const loadFail = createAction('[Test API] Load Fail', httpError());

  describe('with boolean loading', () => {
    const initialState = { loading: false, error: undefined as HttpError };
    const reducer = createReducer(
      initialState,
      setLoadingOn(load),
      setErrorOn(loadFail),
      unsetLoadingAndErrorOn(loadSuccess)
    );

    describe('on load action', () => {
      it('should set loading to true when reducing load action', () => {
        const state = reducer(initialState, load());
        expect(state).toMatchInlineSnapshot(`
          Object {
            "error": undefined,
            "loading": true,
          }
        `);
      });

      describe('on load success', () => {
        it('should set loading to false on load success', () => {
          const state = reducer({ ...initialState, loading: true }, loadSuccess({ entities: [] }));
          expect(state).toMatchInlineSnapshot(`
            Object {
              "error": undefined,
              "loading": false,
            }
          `);
        });
      });

      describe('on load fail', () => {
        it('should set error to error and loading to false on load fail', () => {
          const state = reducer(
            { ...initialState, loading: true },
            loadFail({ error: makeHttpError({ message: 'ERROR' }) })
          );
          expect(state).toMatchInlineSnapshot(`
            Object {
              "error": Object {
                "message": "ERROR",
                "name": "HttpErrorResponse",
              },
              "loading": false,
            }
          `);
        });
      });
    });
  });

  describe('with number loading', () => {
    const initialState = { loading: 0, error: undefined as HttpError };
    const reducer = createReducer(
      initialState,
      setLoadingOn(load),
      setErrorOn(loadFail),
      unsetLoadingAndErrorOn(loadSuccess)
    );

    describe('on load action', () => {
      it('should increase loading when reducing load action', () => {
        const state = reducer(initialState, load());
        expect(state).toMatchInlineSnapshot(`
          Object {
            "error": undefined,
            "loading": 1,
          }
        `);
      });

      describe('on load success', () => {
        it('should decrease loading on load success', () => {
          const state = reducer({ ...initialState, loading: 1 }, loadSuccess({ entities: [] }));
          expect(state).toMatchInlineSnapshot(`
            Object {
              "error": undefined,
              "loading": 0,
            }
          `);
        });
      });

      describe('on load fail', () => {
        it('should set error to error and decrease loading on load fail', () => {
          const state = reducer(
            { ...initialState, loading: 1 },
            loadFail({ error: makeHttpError({ message: 'ERROR' }) })
          );
          expect(state).toMatchInlineSnapshot(`
            Object {
              "error": Object {
                "message": "ERROR",
                "name": "HttpErrorResponse",
              },
              "loading": 0,
            }
          `);
        });
      });

      describe('on second load action', () => {
        it('should increase loading more when reducing second load action', () => {
          const state = reducer({ ...initialState, loading: 1 }, load());
          expect(state).toMatchInlineSnapshot(`
            Object {
              "error": undefined,
              "loading": 2,
            }
          `);
        });
      });
    });

    describe('dev warning', () => {
      let consoleSpy: jest.SpyInstance;

      beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'warn').mockImplementationOnce(noop);
      });

      afterEach(() => {
        consoleSpy.mockClear();
      });

      describe('on load success', () => {
        it('should warn when loading would be decreased below 0', () => {
          const state = reducer({ ...initialState, loading: 0 }, loadSuccess({ entities: [] }));
          expect(state).toMatchInlineSnapshot(`
            Object {
              "error": undefined,
              "loading": 0,
            }
          `);
          expect(consoleSpy).toHaveBeenCalled();
        });
      });

      describe('on load fail', () => {
        it('should warn when loading would be decreased below 0', () => {
          const state = reducer(
            { ...initialState, loading: 0 },
            loadFail({ error: makeHttpError({ message: 'ERROR' }) })
          );
          expect(state).toMatchInlineSnapshot(`
            Object {
              "error": Object {
                "message": "ERROR",
                "name": "HttpErrorResponse",
              },
              "loading": 0,
            }
          `);
          expect(consoleSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
