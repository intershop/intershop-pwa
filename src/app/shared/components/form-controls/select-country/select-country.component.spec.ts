import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito';
import { CountryService } from '../../../services/countries/country.service';
import { SelectCountryComponent } from './select-country.component';

describe('Select Country Component', () => {
  let component: SelectCountryComponent;
  let fixture: ComponentFixture<SelectCountryComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const translateServiceMock = mock(TranslateService);
    when(translateServiceMock.get(anything())).thenCall((data) => {
      if (data === 'labelKey') {
        return Observable.of('LabelName');
      } else {
        return Observable.of(null);
      }
    });
    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(
      [
        { countryCode: 'BG', name: 'Bulgaria' },
        { countryCode: 'DE', name: 'Germany' },
        { countryCode: 'FR', name: 'France' }
      ]);

    TestBed.configureTestingModule({
      declarations: [SelectCountryComponent],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) },
        { provide: CountryService, useFactory: () => instance(countryServiceMock) }
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
    expect(component.label).toEqual('Country', 'label should be <Country>');
  });

  it('should get and display countries on creation', () => {
    fixture.detectChanges();
    expect(component.options.length).toEqual(3, '3 countries are in the options array');
    expect(element.querySelector('select[data-testing-id=countryCode]')).toBeTruthy('country select is rendered');
  });
});
