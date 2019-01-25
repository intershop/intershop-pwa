import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { LARGE_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';

import { AccountNavigationComponent } from './account-navigation.component';

describe('Account Navigation Component', () => {
  let component: AccountNavigationComponent;
  let fixture: ComponentFixture<AccountNavigationComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountNavigationComponent],
      imports: [
        FeatureToggleModule,
        RouterTestingModule,
        StoreModule.forRoot(
          { configuration: configurationReducer },
          { initialState: { configuration: { features: ['quoting'] } } }
        ),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display link to quote list', () => {
    fixture.detectChanges();
    expect(element.querySelector('a[href="/account/quote-list"]')).toBeTruthy();
  });
});
