import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { findAllIshElements } from '../../../utils/dev/html-query-utils';
import { MockComponent } from '../../../utils/dev/mock.component';
import { ShoppingState } from '../../store/shopping.state';
import { shoppingReducers } from '../../store/shopping.system';
import { ComparePageContainerComponent } from './compare-page.container';

describe('Compare Page Container', () => {
  let fixture: ComponentFixture<ComparePageContainerComponent>;
  let element: HTMLElement;
  let component: ComparePageContainerComponent;
  let storeMock: Store<ShoppingState>;

  beforeEach(async(() => {
    storeMock = mock(Store);
    when(storeMock.pipe(anything())).thenReturn(of({}) as any);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent({ selector: 'ish-product-compare-list', template: 'Product Compare List Component', inputs: ['compareProducts', 'totalItems'] }),
        MockComponent({ selector: 'ish-pagination', template: 'Pagination Component', inputs: ['itemsPerPage', 'totalItems'] }),
        ComparePageContainerComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers)
        })
      ],
      providers: [
        { provide: Store, useFactory: () => instance(storeMock) }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePageContainerComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
    component.itemsPerPage = 2;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display compare product list and pagination when compare products available', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-pagination', 'ish-product-compare-list']);
  });

  it('should test if removeProductCompare method is called', () => {
    component.removeProductCompare('111');
    verify(storeMock.dispatch(anything())).called();
  });

  it('should test if onPageChanged method is called', () => {
    component.onPageChanged({ currentPage: 1, itemsPerPage: 2 });
    verify(storeMock.pipe(anything())).called();
  });
});
