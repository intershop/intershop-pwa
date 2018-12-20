import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';
import { LoadQuoteRequests } from '../../store/quote-request';
import { quotingReducers } from '../../store/quoting-store.module';

import { QuoteRequestEditPageContainerComponent } from './quote-request-edit-page.container';

describe('Quote Request Edit Page Container', () => {
  let component: QuoteRequestEditPageContainerComponent;
  let fixture: ComponentFixture<QuoteRequestEditPageContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        MockComponent({ selector: 'ish-quote-edit', template: 'Quote Edit Component', inputs: ['quote', 'user'] }),
        QuoteRequestEditPageContainerComponent,
      ],
      imports: [
        StoreModule.forRoot({
          quoting: combineReducers(quotingReducers),
          shopping: combineReducers(shoppingReducers),
        }),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteRequestEditPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    store$ = TestBed.get(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render loading component if quote requests loading', () => {
    store$.dispatch(new LoadQuoteRequests());
    fixture.detectChanges();
    expect(element.querySelector('ish-loading')).toBeTruthy();
  });
});
