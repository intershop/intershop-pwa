import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { LARGE_BREAKPOINT_WIDTH, SMALL_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { IconModule } from 'ish-core/icon.module';
import { HeaderNavigationContainerComponent } from '../../containers/header-navigation/header-navigation.container';
import { LanguageSwitchContainerComponent } from '../../containers/language-switch/language-switch.container';
import { LoginStatusContainerComponent } from '../../containers/login-status/login-status.container';
import { MiniBasketContainerComponent } from '../../containers/mini-basket/mini-basket.container';
import { ProductCompareStatusContainerComponent } from '../../containers/product-compare-status/product-compare-status.container';
import { SearchBoxContainerComponent } from '../../containers/search-box/search-box.container';
import { UserInformationMobileComponent } from '../user-information-mobile/user-information-mobile.component';

import { HeaderStickyComponent } from './header-sticky.component';

describe('Header Sticky Component', () => {
  let component: HeaderStickyComponent;
  let fixture: ComponentFixture<HeaderStickyComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconModule, NgbCollapseModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        HeaderStickyComponent,
        MockComponent(HeaderNavigationContainerComponent),
        MockComponent(LanguageSwitchContainerComponent),
        MockComponent(LoginStatusContainerComponent),
        MockComponent(MiniBasketContainerComponent),
        MockComponent(ProductCompareStatusContainerComponent),
        MockComponent(SearchBoxContainerComponent),
        MockComponent(UserInformationMobileComponent),
      ],
      providers: [
        { provide: SMALL_BREAKPOINT_WIDTH, useValue: 576 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeaderStickyComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderStickyComponent);
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
