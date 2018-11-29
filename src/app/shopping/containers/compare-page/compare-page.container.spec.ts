import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { anything, spy, verify } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { findAllIshElements } from '../../../utils/dev/html-query-utils';
import { MockComponent } from '../../../utils/dev/mock.component';
import { TestStore, ngrxTesting } from '../../../utils/dev/ngrx-testing';
import { AddToCompare } from '../../store/compare';
import { LoadProductSuccess } from '../../store/products';
import { shoppingReducers } from '../../store/shopping.system';

import { ComparePageContainerComponent } from './compare-page.container';

describe('Compare Page Container', () => {
  let fixture: ComponentFixture<ComparePageContainerComponent>;
  let element: HTMLElement;
  let component: ComparePageContainerComponent;
  let store$: TestStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ComparePageContainerComponent,
        MockComponent({
          selector: 'ish-product-compare-list',
          template: 'Product Compare List Component',
          inputs: ['compareProducts'],
        }),
      ],
      imports: [
        ...ngrxTesting({
          shopping: combineReducers(shoppingReducers),
        }),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    store$ = TestBed.get(TestStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePageContainerComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not display compare product list when no compare products available', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toBeEmpty();
  });

  it('should display compare product list when compare products available', () => {
    store$.dispatch(new LoadProductSuccess({ sku: '1' } as Product));
    store$.dispatch(new LoadProductSuccess({ sku: '2' } as Product));
    store$.dispatch(new AddToCompare('1'));
    store$.dispatch(new AddToCompare('2'));

    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-product-compare-list']);
  });

  it('should dispatch an action if removeProductCompare is called', () => {
    const storeSpy = spy(TestBed.get(Store));
    component.removeFromCompare('111');
    verify(storeSpy.dispatch(anything())).called();
  });
});
