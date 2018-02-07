import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';
import { CountryService } from '../../../core/services/countries/country.service';
import { RegionService } from '../../../core/services/countries/region.service';
import { GO, RouterAction, State } from '../../../core/store';
import { MockComponent } from '../../../mocking/components/mock.component';
import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPage Component', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let element: HTMLElement;
  let storeMock: Store<State>;

  beforeEach(async(() => {
    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(of([]));
    const regionServiceMock = mock(RegionService);
    when(regionServiceMock.getRegions(anything())).thenReturn(of([]));
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

  it('should navigate to homepage when cancel is clicked', async(() => {
    component.onCancel();
    verify(storeMock.dispatch(anything())).once();
    const [action] = capture(storeMock.dispatch).last();
    expect((action as RouterAction).type).toBe(GO);
  }));
});
