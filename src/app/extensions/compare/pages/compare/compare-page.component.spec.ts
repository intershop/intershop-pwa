import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';

import { CompareFacade } from '../../facades/compare.facade';

import { ComparePageComponent } from './compare-page.component';
import { ProductCompareListComponent } from './product-compare-list/product-compare-list.component';

describe('Compare Page Component', () => {
  let fixture: ComponentFixture<ComparePageComponent>;
  let element: HTMLElement;
  let component: ComparePageComponent;
  let compareFacade: CompareFacade;

  beforeEach(async () => {
    compareFacade = mock(CompareFacade);
    await TestBed.configureTestingModule({
      declarations: [ComparePageComponent, MockComponent(ProductCompareListComponent)],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: CompareFacade, useFactory: () => instance(compareFacade) }],
    }).compileComponents();
  });

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
    expect(findAllCustomElements(element)).toBeEmpty();
  });

  it('should display compare product list when compare products available', () => {
    when(compareFacade.compareProductsCount$).thenReturn(of(2));

    fixture.detectChanges();
    expect(findAllCustomElements(element)).toEqual(['ish-product-compare-list']);
  });
});
