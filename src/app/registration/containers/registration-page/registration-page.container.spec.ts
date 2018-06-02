import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { AVAILABLE_LOCALES } from '../../../core/configurations/injection-keys';
import { RegionService } from '../../../core/services/countries/region.service';
import { CoreState } from '../../../core/store/core.state';
import { Locale } from '../../../models/locale/locale.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { RegistrationPageContainerComponent } from './registration-page.container';

describe('Registration Page Container', () => {
  let fixture: ComponentFixture<RegistrationPageContainerComponent>;
  let component: RegistrationPageContainerComponent;
  let element: HTMLElement;
  let routerMock: Router;
  let storeMock$: Store<CoreState>;
  const defaultLocales = [
    { lang: 'de_DE', value: 'de', displayName: 'Deutsch' },
    { lang: 'fr_FR', value: 'fr', displayName: 'Fran¢aise' },
  ] as Locale[];

  beforeEach(async(() => {
    routerMock = mock(Router);
    storeMock$ = mock(Store);

    const regionServiceMock = mock(RegionService);
    when(regionServiceMock.getRegions(anything())).thenReturn(
      of([
        { countryCode: 'DE', regionCode: 'AL', name: 'Alabama' },
        { countryCode: 'DE', regionCode: 'FL', name: 'Florida' },
      ])
    );

    TestBed.configureTestingModule({
      declarations: [
        RegistrationPageContainerComponent,
        MockComponent({
          selector: 'ish-registration-form',
          template: 'Form Template',
          inputs: ['countries', 'languages', 'regions', 'titles', 'error'],
        }),
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

  it('should retrieve countries and languages on creation', done => {
    fixture.detectChanges();
    component.languages$.subscribe(result => {
      expect(result.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should retrieve regions if country changes', done => {
    component.updateData('DE');
    component.regionsForSelectedCountry$.subscribe(result => {
      expect(result.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should retrieve titles if country changes', done => {
    component.updateData('DE');
    component.titlesForSelectedCountry$.subscribe(result => {
      expect(result.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should navigate to homepage when cancel is clicked', async(() => {
    component.onCancel();

    verify(routerMock.navigate(anything())).once();
    const [param] = capture(routerMock.navigate).last();
    expect(param).toEqual(['/home']);
  }));
});
