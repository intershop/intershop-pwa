import { HeaderSlotComponent } from './header.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { MockComponent } from 'app/components/mock.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { GlobalState } from 'app/services/global.state';
import { WishListService } from 'app/services/wishlists/wishlists.service';
import { Observable } from 'rxjs/Observable';

describe('Header Slot Component', () => {
  let fixture: ComponentFixture<HeaderSlotComponent>;
  let component: HeaderSlotComponent;
  let element: HTMLElement;
  let debugEl: DebugElement;

  class GlobalStateServiceStub {
    notifyDataChanged(event, value) {
      return true;
    }
    subscribe(event: string, callback: Function) {
      callback();
    }
  };

  class WishListServiceStub {
    getWishList() {
      return Observable.of(null);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CollapseModule],
      providers: [
        { provider: WishListService, useClass: WishListServiceStub },
        { provide: GlobalState, useClass: GlobalStateServiceStub }

      ],
      declarations: [
        HeaderSlotComponent,
        MockComponent({ selector: 'is-login-status', template: 'Login Status Template' }),
        MockComponent({ selector: 'is-product-compare-status', template: 'Product Compare Status Template' }),
        MockComponent({ selector: 'is-wishlist-status', template: 'Wish List Template' }),
        MockComponent({ selector: 'is-language-switch', template: 'Language Switch Template' }),
        MockComponent({ selector: 'is-search-box', template: 'Search Box Template' }),
        MockComponent({ selector: 'is-header-navigation', template: 'Header Navigation Template' }),
        MockComponent({ selector: 'is-mini-cart', template: 'Mini Cart Template' }),
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HeaderSlotComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      debugEl = fixture.debugElement;
    });

  }));

  xit('should check "User Links" are rendered on template', () => {
    expect(element.getElementsByClassName('user-links')[0].childElementCount).toBe(4);
    expect(element.getElementsByTagName('is-login-status')[0].textContent).toContain('Login Status Template');
    expect(element.getElementsByTagName('is-product-compare-status')[0].textContent).toContain('Product Compare Status Template');
    expect(element.getElementsByTagName('is-wishlist-status')[0].textContent).toContain('Wish List Template');
  });

  xit('should check "LanguageSwitchComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('is-language-switch')[0].textContent).toContain('Language Switch Template');
  });

  xit('should check "SearchBoxComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('is-search-box')[0].textContent).toContain('Search Box Template');
  });

  xit('should check "HeaderNavigationComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('is-header-navigation')[0].textContent).toContain('Header Navigation Template');
  });

  xit('should check "MinicartComponent" is rendered on template', () => {
    expect(element.getElementsByTagName('is-mini-cart')[0].textContent).toContain('Mini Cart Template');
  });
});

