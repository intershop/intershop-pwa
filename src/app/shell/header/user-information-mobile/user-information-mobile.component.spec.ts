import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { LanguageSwitchComponent } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';
import { MiniBasketComponent } from 'ish-shell/header/mini-basket/mini-basket.component';
import { ProductCompareStatusComponent } from 'ish-shell/header/product-compare-status/product-compare-status.component';

import { LazyWishlistsLinkComponent } from '../../../extensions/wishlists/exports/wishlists/lazy-wishlists-link/lazy-wishlists-link.component';

import { UserInformationMobileComponent } from './user-information-mobile.component';

describe('User Information Mobile Component', () => {
  let component: UserInformationMobileComponent;
  let fixture: ComponentFixture<UserInformationMobileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(LanguageSwitchComponent),
        MockComponent(LazyWishlistsLinkComponent),
        MockComponent(LoginStatusComponent),
        MockComponent(MiniBasketComponent),
        MockComponent(ProductCompareStatusComponent),
        MockDirective(FeatureToggleDirective),
        UserInformationMobileComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInformationMobileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
