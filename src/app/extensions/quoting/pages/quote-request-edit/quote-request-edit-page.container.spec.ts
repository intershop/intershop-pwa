import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoadingComponent } from '../../../../shared/common/components/loading/loading.component';
import { QuoteEditComponent } from '../../shared/quote/components/quote-edit/quote-edit.component';
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
        MockComponent(LoadingComponent),
        MockComponent(QuoteEditComponent),
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
