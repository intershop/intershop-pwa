import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { instance, mock } from 'ts-mockito';
import { CartStatusService } from '../../../core/services/cart-status/cart-status.service';
import { MockComponent } from '../../../mocking/components/mock.component';
import { HeaderComponent } from './header.component';

describe('Header Component', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CollapseModule,
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        { provide: CartStatusService, useFactory: () => instance(mock(CartStatusService)) },

      ],
      declarations: [
        HeaderComponent,
        MockComponent({ selector: 'ish-login-status', template: 'Login Status Template' }),
        MockComponent({ selector: 'ish-product-compare-status', template: 'Product Compare Status Template' }),
        MockComponent({ selector: 'ish-wishlist-status', template: 'Wish List Template' }),
        MockComponent({ selector: 'ish-language-switch', template: 'Language Switch Template' }),
        MockComponent({ selector: 'ish-search-box', template: 'Search Box Template' }),
        MockComponent({ selector: 'ish-header-navigation', template: 'Header Navigation Template' }),
        MockComponent({ selector: 'ish-mini-cart', template: 'Mini Cart Template' }),
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });

  }));

  it('should check "User Links" are rendered on template', () => {
    expect(element.getElementsByClassName('user-links')[0].childElementCount).toBe(4);
    expect(element.getElementsByTagName('ish-login-status')[0].textContent).toContain('Login Status Template');
    expect(element.getElementsByTagName('ish-product-compare-status')[0].textContent).toContain('Product Compare Status Template');
    expect(element.getElementsByTagName('ish-wishlist-status')[0].textContent).toContain('Wish List Template');
  });

  it('should check "LanguageSwitchComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('ish-language-switch')[0].textContent).toContain('Language Switch Template');
  });

  it('should check "SearchBoxComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('ish-search-box')[0].textContent).toContain('Search Box Template');
  });

  it('should check "HeaderNavigationComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('ish-header-navigation')[0].textContent).toContain('Header Navigation Template');
  });

  it('should check "MiniCartComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('ish-mini-cart')[0].textContent).toContain('Mini Cart Template');
  });
});

