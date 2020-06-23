import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
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
      imports: [FeatureToggleModule, RouterTestingModule],
      declarations: [
        HeaderComponent,
        MockComponent(HeaderCheckoutComponent),
        MockComponent(HeaderDefaultComponent),
        MockComponent(HeaderSimpleComponent),
      ],
      providers: [{ provide: AppFacade, useFactory: () => instance(mock(AppFacade)) }],
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
