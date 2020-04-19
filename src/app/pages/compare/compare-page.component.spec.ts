import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';

import { ComparePageComponent } from './compare-page.component';
import { ProductCompareListComponent } from './product-compare-list/product-compare-list.component';

describe('Compare Page Component', () => {
  let fixture: ComponentFixture<ComparePageComponent>;
  let element: HTMLElement;
  let component: ComparePageComponent;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);
    TestBed.configureTestingModule({
      declarations: [ComparePageComponent, MockComponent(ProductCompareListComponent)],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparePageComponent);
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
    when(shoppingFacade.compareProductsCount$).thenReturn(of(2));

    fixture.detectChanges();
    expect(findAllIshElements(element)).toEqual(['ish-product-compare-list']);
  });

  it('should dispatch an action if removeProductCompare is called', () => {
    component.removeFromCompare('111');
    verify(shoppingFacade.removeProductFromCompare('111')).called();
  });
});
