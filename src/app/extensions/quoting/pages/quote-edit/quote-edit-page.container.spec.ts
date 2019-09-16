import { Location } from '@angular/common';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';

import { QuoteEditComponent } from '../../shared/quote/components/quote-edit/quote-edit.component';
import { LoadQuotes } from '../../store/quote';
import { quotingReducers } from '../../store/quoting-store.module';

import { QuoteEditPageContainerComponent } from './quote-edit-page.container';

describe('Quote Edit Page Container', () => {
  let component: QuoteEditPageContainerComponent;
  let fixture: ComponentFixture<QuoteEditPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(QuoteEditComponent),
        QuoteEditPageContainerComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'basket', component: QuoteEditPageContainerComponent }]),
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            quoting: combineReducers(quotingReducers),
            shopping: combineReducers(shoppingReducers),
          },
        }),
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

  it('should navigate to basket when addToBasket is clicked', fakeAsync(() => {
    component.addQuoteToBasket(undefined);
    tick(50);
    expect(location.path()).toBe('/basket');
  }));
});
