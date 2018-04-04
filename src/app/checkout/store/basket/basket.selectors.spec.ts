import { TestBed } from '@angular/core/testing';
import { routerReducer } from '@ngrx/router-store';
import { combineReducers, StoreModule } from '@ngrx/store';
import { checkoutReducers } from '../checkout.system';

describe('Categories Selectors', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          checkout: combineReducers(checkoutReducers),
          routerReducer
        })
      ]
    });
  });
});
