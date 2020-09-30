import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { ProductCompareStatusComponent } from './product-compare-status.component';

describe('Product Compare Status Component', () => {
  let component: ProductCompareStatusComponent;
  let fixture: ComponentFixture<ProductCompareStatusComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;
  let location: Location;

  beforeEach(async () => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [DummyComponent, MockComponent(FaIconComponent), ProductCompareStatusComponent],
      imports: [
        RouterTestingModule.withRoutes([{ path: 'compare', component: DummyComponent }]),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
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
    when(shoppingFacade.compareProductsCount$).thenReturn(of(123456789));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <a
        class="compare-status item-count-container"
        rel="nofollow"
        routerlink="/compare"
        ng-reflect-router-link="/compare"
        href="/compare"
        ><fa-icon class="header-icon" ng-reflect-icon="fas,columns"></fa-icon
        ><span class="badge badge-pill" data-testing-id="product-compare-count">123456789</span
        ><span class="d-none d-md-inline">product.compare.link</span></a
      >
    `);
    expect(element.textContent).toContain('123456789');
  });
});
