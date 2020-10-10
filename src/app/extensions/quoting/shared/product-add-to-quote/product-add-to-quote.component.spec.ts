import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductAddToQuoteComponent } from './product-add-to-quote.component';

describe('Product Add To Quote Component', () => {
  let component: ProductAddToQuoteComponent;
  let fixture: ComponentFixture<ProductAddToQuoteComponent>;
  let element: HTMLElement;
  let location: Location;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'addToQuote')).thenReturn(of(true));

    @Component({ template: 'dummy' })
    class DummyComponent {}

    const accountFacade = mock(AccountFacade);
    when(accountFacade.isLoggedIn$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }]), TranslateModule.forRoot()],
      declarations: [DummyComponent, MockComponent(FaIconComponent), ProductAddToQuoteComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddToQuoteComponent);
    component = fixture.componentInstance;
    when(context.get('sku')).thenReturn('dummy');
    when(context.get('quantity')).thenReturn(5);
    element = fixture.nativeElement;
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should show button when display type is not icon', () => {
    fixture.detectChanges();
    expect(element.querySelector('button')).toBeTruthy();
  });

  it('should show icon button when display type is icon', () => {
    component.displayType = 'icon';
    fixture.detectChanges();
    expect(element.querySelector('fa-icon')).toBeTruthy();
  });

  it('should show disable button when product cannot be added to cart', () => {
    when(context.select('hasQuantityError')).thenReturn(of(true));
    fixture.detectChanges();
    expect(element.querySelector('button').disabled).toBeTruthy();
  });

  it('should route to addToQuote URL when triggered.', fakeAsync(() => {
    fixture.detectChanges();
    component.addToQuote();

    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/addProductToQuoteRequest?sku=dummy&quantity=5"`);
  }));
});
