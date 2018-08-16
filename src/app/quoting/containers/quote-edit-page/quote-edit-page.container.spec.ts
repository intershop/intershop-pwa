import { Location } from '@angular/common';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { shoppingReducers } from '../../../shopping/store/shopping.system';
import { MockComponent } from '../../../utils/dev/mock.component';
import { LoadQuotes } from '../../store/quote';
import { QuotingState } from '../../store/quoting.state';
import { quotingReducers } from '../../store/quoting.system';

import { QuoteEditPageContainerComponent } from './quote-edit-page.container';

describe('Quote Edit Page Container', () => {
  let component: QuoteEditPageContainerComponent;
  let fixture: ComponentFixture<QuoteEditPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<QuotingState>;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuoteEditPageContainerComponent,
        MockComponent({ selector: 'ish-quote-edit', template: 'Quote Edit Component', inputs: ['quote'] }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
      ],
      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot({
          quoting: combineReducers(quotingReducers),
          shopping: combineReducers(shoppingReducers),
        }),
        RouterTestingModule.withRoutes([{ path: 'basket', component: QuoteEditPageContainerComponent }]),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteEditPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
    location = TestBed.get(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if quotes loading', () => {
    store$.dispatch(new LoadQuotes());
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });

  it(
    'should navigate to basket when addToBasket is clicked',
    fakeAsync(() => {
      component.addQuoteToBasket(undefined);
      tick(50);
      expect(location.path()).toBe('/basket');
    })
  );
});
