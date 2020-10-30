import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';
import { mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Product } from 'ish-core/models/product/product.model';

import { ProductAddToQuoteComponent } from './product-add-to-quote.component';

describe('Product Add To Quote Component', () => {
  let component: ProductAddToQuoteComponent;
  let fixture: ComponentFixture<ProductAddToQuoteComponent>;
  let element: HTMLElement;
  let location: Location;

  beforeEach(async () => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    const accountFacade = mock(AccountFacade);
    when(accountFacade.isLoggedIn$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }]), TranslateModule.forRoot()],
      declarations: [DummyComponent, MockComponent(FaIconComponent), ProductAddToQuoteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToQuoteComponent);
    component = fixture.componentInstance;
    component.product = { sku: 'dummy', minOrderQuantity: 5 } as Product;
    element = fixture.nativeElement;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToQuoteComponent);
    component = fixture.componentInstance;
    component.product = { sku: 'dummy', minOrderQuantity: 5 } as Product;
    element = fixture.nativeElement;
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show button when display type is not icon ', () => {
    fixture.detectChanges();
    expect(element.querySelector('button')).toBeTruthy();
  });

  it('should show icon button when display type is icon ', () => {
    component.displayType = 'icon';
    fixture.detectChanges();
    expect(element.querySelector('fa-icon')).toBeTruthy();
  });

  it('should show disable button when "disabled" is set to "false" ', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(element.querySelector('button').disabled).toBeTruthy();
  });

  it('should route to addToQuote URL when triggered.', fakeAsync(() => {
    component.addToQuote();

    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/addProductToQuoteRequest?sku=dummy&quantity=5"`);
  }));
});
