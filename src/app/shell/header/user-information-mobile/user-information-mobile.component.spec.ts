import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleDirective, FeatureToggleModule } from 'ish-core/feature-toggle.imports';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LoginStatusComponent } from 'ish-shell/header/login-status/login-status.component';

import { ProductCompareStatusComponent } from '../../../extensions/compare/shared/product-compare-status/product-compare-status.component';
import { QuickorderLinkComponent } from '../../../extensions/quickorder/shared/quickorder-link/quickorder-link.component';
import { WishlistsLinkComponent } from '../../../extensions/wishlists/shared/wishlists-link/wishlists-link.component';

import { UserInformationMobileComponent } from './user-information-mobile.component';

describe('User Information Mobile Component', () => {
  let component: UserInformationMobileComponent;
  let fixture: ComponentFixture<UserInformationMobileComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInformationMobileComponent],
      providers: [
        ...(FeatureToggleModule.forTesting('compare', 'quickorder', 'wishlists').providers ?? []),
        provideTranslateService(),
      ],
    })
      .overrideComponent(UserInformationMobileComponent, {
        set: {
          imports: [
            FeatureToggleDirective,
            MockComponent(LoginStatusComponent),
            MockComponent(ProductCompareStatusComponent),
            MockComponent(QuickorderLinkComponent),
            MockComponent(WishlistsLinkComponent),
            TranslatePipe,
          ],
        },
      })
      .compileComponents();
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
      [
        "ish-login-status",
        "ish-product-compare-status",
        "ish-quickorder-link",
        "ish-wishlists-link",
      ]
    `);
  });
});
