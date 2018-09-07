import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { MockComponent } from '../../../../utils/dev/mock.component';
import { LARGE_BREAKPOINT_WIDTH, SMALL_BREAKPOINT_WIDTH } from '../../../configurations/injection-keys';
import { IconModule } from '../../../icon.module';

import { HeaderStickyComponent } from './header-sticky.component';

describe('Header Sticky Component', () => {
  let component: HeaderStickyComponent;
  let fixture: ComponentFixture<HeaderStickyComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbCollapseModule, IconModule, TranslateModule.forRoot(), RouterTestingModule],
      declarations: [
        HeaderStickyComponent,
        MockComponent({ selector: 'ish-login-status-container', template: 'Login Status Container' }),
        MockComponent({
          selector: 'ish-product-compare-status-container',
          template: 'Product Compare Status Container',
          inputs: ['views'],
        }),
        MockComponent({ selector: 'ish-language-switch-container', template: 'Language Switch Container' }),
        MockComponent({
          selector: 'ish-search-box-container',
          template: 'Search Box Container',
          inputs: ['configuration'],
        }),
        MockComponent({ selector: 'ish-header-navigation-container', template: 'Header Navigation Container' }),
        MockComponent({ selector: 'ish-mini-basket-container', template: 'Mini Basket Container' }),
        MockComponent({ selector: 'ish-mobile-basket-container', template: 'Mobile Basket Container' }),
        MockComponent({ selector: 'ish-user-information-mobile', template: 'Mobile User Information' }),
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
