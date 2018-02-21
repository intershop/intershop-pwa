import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { CountryService } from '../../../core/services/countries/country.service';
import { RegionService } from '../../../core/services/countries/region.service';
import { CoreState, RouterAction, RouterActionTypes } from '../../../core/store/router';
import { MockComponent } from '../../../mocking/components/mock.component';
import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPage Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let storeMock: Store<CoreState>;

  beforeEach(async(() => {
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
    storeMock = mock(Store);

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
        { provide: Store, useFactory: () => instance(storeMock) },
      ],
      imports: [
        TranslateModule.forRoot(),
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
    verify(storeMock.dispatch(anything())).once();
    const [action] = capture(storeMock.dispatch).last();
    expect((action as RouterAction).type).toBe(RouterActionTypes.Go);
  }));
});
