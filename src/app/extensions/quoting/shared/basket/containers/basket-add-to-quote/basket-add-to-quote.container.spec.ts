import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { anything, spy, verify } from 'ts-mockito';

import { coreReducers } from 'ish-core/store/core-store.module';
import { MockComponent } from 'ish-core/utils/dev/mock.component';
import { quotingReducers } from '../../../../store/quoting-store.module';

import { BasketAddToQuoteContainerComponent } from './basket-add-to-quote.container';

describe('Basket Add To Quote Container', () => {
  let component: BasketAddToQuoteContainerComponent;
  let fixture: ComponentFixture<BasketAddToQuoteContainerComponent>;
  let element: HTMLElement;
  let store$: Store<{}>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ ...coreReducers, quoting: combineReducers(quotingReducers) })],
      declarations: [
        BasketAddToQuoteContainerComponent,
        MockComponent({
          selector: 'ish-basket-add-to-quote',
          template: 'Basket Add To Quote',
        }),
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(BasketAddToQuoteContainerComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        store$ = TestBed.get(Store);
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should dispatch action when addToQuote is triggered.', () => {
    const storeSpy$ = spy(store$);

    component.addToQuote();

    verify(storeSpy$.dispatch(anything())).once();
  });
});
