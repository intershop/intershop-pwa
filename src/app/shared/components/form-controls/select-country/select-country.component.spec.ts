import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { instance, mock, when } from 'ts-mockito';
import { CountryService } from '../../../services/countries/country.service';
import { SelectCountryComponent } from './select-country.component';

describe('Select Country Component', () => {
  let component: SelectCountryComponent;
  let fixture: ComponentFixture<SelectCountryComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(
      Observable.of(
        { countryCode: 'BG', name: 'Bulgaria' },
        { countryCode: 'DE', name: 'Germany' },
        { countryCode: 'FR', name: 'France' }
      ));

    TestBed.configureTestingModule({
      declarations: [SelectCountryComponent],
      providers: [
        { provide: CountryService, useFactory: () => instance(countryServiceMock) }
      ],
      imports: [
        TranslateModule.forRoot()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(SelectCountryComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          countryCode: new FormControl(),
          state: new FormControl('Region1', [Validators.required])
        });
        component.form = form;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('countryCode', 'control Name should be <countryCode>');
    expect(component.label).toEqual('account.default_address.country.label', 'label key should be <account.default_address.country.label>');
  });

  it('should get and display countries on creation', () => {
    fixture.detectChanges();
    expect(component.options.length).toEqual(3, '3 countries are in the options array');
    expect(element.querySelector('select[data-testing-id=countryCode]')).toBeTruthy('country select is rendered');
  });
});
