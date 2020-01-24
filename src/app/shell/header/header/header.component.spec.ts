import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { HeaderCheckoutComponent } from 'ish-shell/header/header-checkout/header-checkout.component';
import { HeaderDefaultComponent } from 'ish-shell/header/header-default/header-default.component';
import { HeaderSimpleComponent } from 'ish-shell/header/header-simple/header-simple.component';

import { HeaderComponent } from './header.component';

describe('Header Component', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FeatureToggleModule, RouterTestingModule, ngrxTesting({ reducers: coreReducers })],
      declarations: [
        HeaderComponent,
        MockComponent(HeaderCheckoutComponent),
        MockComponent(HeaderDefaultComponent),
        MockComponent(HeaderSimpleComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render default header component if no headerType is set', () => {
    fixture.detectChanges();
    expect(findAllIshElements(element)).toContain('ish-header-default');
  });
});
