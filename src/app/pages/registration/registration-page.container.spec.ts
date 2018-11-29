import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { AVAILABLE_LOCALES } from 'ish-core/configurations/injection-keys';
import { Locale } from 'ish-core/models/locale/locale.model';
import { RegionService } from 'ish-core/services/region/region.service';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { RegistrationPageContainerComponent } from './registration-page.container';

describe('Registration Page Container', () => {
  let fixture: ComponentFixture<RegistrationPageContainerComponent>;
  let component: RegistrationPageContainerComponent;
  let element: HTMLElement;
  let routerMock: Router;
  let storeMock$: Store<{}>;
  const defaultLocales = [
    { lang: 'de_DE', value: 'de', displayName: 'Deutsch' },
    { lang: 'fr_FR', value: 'fr', displayName: 'Fran¢aise' },
  ] as Locale[];

  beforeEach(async(() => {
    routerMock = mock(Router);
    storeMock$ = mock(Store);

    const regionServiceMock = mock(RegionService);
    when(regionServiceMock.getRegions(anything())).thenReturn([
      { countryCode: 'DE', regionCode: 'AL', name: 'Alabama' },
      { countryCode: 'DE', regionCode: 'FL', name: 'Florida' },
    ]);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-registration-form',
          template: 'Form Template',
          inputs: ['countries', 'languages', 'regions', 'titles', 'error'],
        }),
        RegistrationPageContainerComponent,
      ],
      providers: [
        { provide: RegionService, useFactory: () => instance(regionServiceMock) },
        { provide: Router, useFactory: () => instance(routerMock) },
        { provide: Store, useFactory: () => instance(storeMock$) },
        { provide: AVAILABLE_LOCALES, useValue: defaultLocales },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should retrieve regions if country changes', () => {
    component.updateData('DE');
    expect(component.regionsForSelectedCountry.length).toBeGreaterThan(0);
  });

  it('should retrieve titles if country changes', () => {
    component.updateData('DE');
    expect(component.titlesForSelectedCountry.length).toBeGreaterThan(0);
  });

  it('should navigate to homepage when cancel is clicked', async(() => {
    component.onCancel();

    verify(routerMock.navigate(anything())).once();
    const [param] = capture(routerMock.navigate).last();
    expect(param).toEqual(['/home']);
  }));
});
