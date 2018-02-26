import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { CountryService } from '../../../core/services/countries/country.service';
import { RegionService } from '../../../core/services/countries/region.service';
import { CoreState } from '../../../core/store/core.state';
import { MockComponent } from '../../../dev-utils/mock.component';
import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPage Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let routerMock: Router;
  let storeMock: Store<CoreState>;

  beforeEach(async(() => {
    routerMock = mock(Router);
    storeMock = mock(Store);

    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(of([
      { countryCode: 'BG', name: 'Bulgaria' },
      { countryCode: 'DE', name: 'Germany' }
    ]));
    const regionServiceMock = mock(RegionService);
    when(regionServiceMock.getRegions(anything())).thenReturn(of([
      { countryCode: 'DE', regionCode: 'AL', name: 'Alabama' },
      { countryCode: 'DE', regionCode: 'FL', name: 'Florida' }
    ]));

    TestBed.configureTestingModule({
      declarations: [RegistrationPageComponent,
        MockComponent({
          selector: 'ish-registration-form',
          template: 'Form Template',
          inputs: [
            'countries',
            'languages',
            'regions',
            'titles',
            'emailOptIn'
          ]
        }),
      ],
      providers: [
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
        { provide: RegionService, useFactory: () => instance(regionServiceMock) },
        { provide: Router, useFactory: () => instance(routerMock) },
        { provide: Store, useFactory: () => instance(storeMock) },
      ],
      imports: [
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should retrieve countries and languages on creation', () => {
    fixture.detectChanges();
    component.countries$.subscribe(result => expect(result.length).toBeGreaterThan(0));
    component.languages$.subscribe(result => expect(result.length).toBeGreaterThan(0));
  });

  it('should retrieve regions and titles if country changes', () => {
    component.updateData('DE');
    component.regionsForSelectedCountry$.subscribe(result => expect(result.length).toBeGreaterThan(0));
    component.titlesForSelectedCountry$.subscribe(result => expect(result.length).toBeGreaterThan(0));
  });

  it('should navigate to homepage when cancel is clicked', async(() => {
    component.onCancel();

    verify(routerMock.navigate(anything())).once();
    const [param] = capture(routerMock.navigate).last();
    expect(param).toEqual(['/home']);
  }));
});
