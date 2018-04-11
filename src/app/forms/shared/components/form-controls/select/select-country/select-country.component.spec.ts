import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectCountryComponent } from './select-country.component';

describe('Select Country Component', () => {
  let component: SelectCountryComponent;
  let fixture: ComponentFixture<SelectCountryComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SelectCountryComponent],
        imports: [TranslateModule.forRoot()],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(SelectCountryComponent);
          component = fixture.componentInstance;
          element = fixture.nativeElement;

          const form = new FormGroup({
            countryCode: new FormControl(),
            state: new FormControl('Region1', [Validators.required]),
          });
          component.form = form;
          component.countries = [
            { countryCode: 'BG', name: 'Bulgaria' },
            { countryCode: 'DE', name: 'Germany' },
            { countryCode: 'FR', name: 'France' },
          ];
        });
    })
  );

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('countryCode', 'control Name should be <countryCode>');
    expect(component.label).toEqual('Country', 'label key should be Country');
  });

  it('should display countries if component input changes', () => {
    const changes: SimpleChanges = {
      countries: new SimpleChange(null, component.countries, false),
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();
    expect(component.options.length).toEqual(3, '3 countries are in the options array');
    expect(element.querySelector('select[data-testing-id=countryCode]')).toBeTruthy('country select is rendered');
  });
});
