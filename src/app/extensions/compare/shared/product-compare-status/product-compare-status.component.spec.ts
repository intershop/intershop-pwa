import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CompareFacade } from '../../facades/compare.facade';

import { ProductCompareStatusComponent } from './product-compare-status.component';

describe('Product Compare Status Component', () => {
  let component: ProductCompareStatusComponent;
  let fixture: ComponentFixture<ProductCompareStatusComponent>;
  let element: HTMLElement;
  let compareFacade: CompareFacade;
  let location: Location;

  beforeEach(async () => {
    compareFacade = mock(CompareFacade);

    await TestBed.configureTestingModule({
      imports: [ProductCompareStatusComponent],
      providers: [
        { provide: CompareFacade, useFactory: () => instance(compareFacade) },
        provideRouter([{ path: 'compare', children: [] }]),
        provideTranslateService(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCompareStatusComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should navigate to compare page when compare icon is clicked', async () => {
    fixture.detectChanges();
    element.querySelector('a').click();
    await fixture.whenStable();

    expect(location.path()).toContain('compare');
  });

  it('should display product compare count when rendered', () => {
    when(compareFacade.compareProductsCount$).thenReturn(of(123456789));
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="product-compare-count"]')?.textContent).toMatchInlineSnapshot(
      `"123456789"`
    );
  });
});
