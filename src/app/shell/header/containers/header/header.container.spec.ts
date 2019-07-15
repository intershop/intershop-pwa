import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { HeaderCheckoutComponent } from '../../components/header-checkout/header-checkout.component';
import { HeaderSimpleComponent } from '../../components/header-simple/header-simple.component';
import { HeaderComponent } from '../../components/header/header.component';

import { HeaderContainerComponent } from './header.container';

describe('Header Container', () => {
  let component: HeaderContainerComponent;
  let fixture: ComponentFixture<HeaderContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FeatureToggleModule, RouterTestingModule, StoreModule.forRoot(coreReducers)],
      declarations: [
        HeaderContainerComponent,
        MockComponent(HeaderCheckoutComponent),
        MockComponent(HeaderComponent),
        MockComponent(HeaderSimpleComponent),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderContainerComponent);
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
    expect(findAllIshElements(element)).toContain('ish-header');
  });
});
