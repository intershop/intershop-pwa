import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LanguageSwitchComponent } from 'ish-shell/header/language-switch/language-switch.component';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';

import { LazyProductCompareStatusComponent } from '../../../extensions/compare/exports/lazy-product-compare-status/lazy-product-compare-status.component';
import { LazyQuickorderLinkComponent } from '../../../extensions/quickorder/exports/lazy-quickorder-link/lazy-quickorder-link.component';
import { LazyWishlistsLinkComponent } from '../../../extensions/wishlists/exports/lazy-wishlists-link/lazy-wishlists-link.component';

import { UserInformationMobileComponent } from './user-information-mobile.component';

describe('User Information Mobile Component', () => {
  let component: UserInformationMobileComponent;
  let fixture: ComponentFixture<UserInformationMobileComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('compare', 'quickorder', 'wishlists'), TranslateModule.forRoot()],
      declarations: [
        MockComponent(LanguageSwitchComponent),
        MockComponent(LazyProductCompareStatusComponent),
        MockComponent(LazyQuickorderLinkComponent),
        MockComponent(LazyWishlistsLinkComponent),
        MockComponent(LoginStatusComponent),
        UserInformationMobileComponent,
      ],
    }).compileComponents();
  });

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

  it('should create all elements on the component', () => {
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-login-status",
        "ish-lazy-product-compare-status",
        "ish-lazy-quickorder-link",
        "ish-lazy-wishlists-link",
        "ish-language-switch",
      ]
    `);
  });
});
