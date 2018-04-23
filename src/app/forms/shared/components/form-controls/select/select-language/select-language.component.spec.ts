import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Locale } from '../../../../../../models/locale/locale.model';
import { SelectLanguageComponent } from './select-language.component';

describe('Select Language Component', () => {
  let component: SelectLanguageComponent;
  let fixture: ComponentFixture<SelectLanguageComponent>;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SelectLanguageComponent],
        imports: [TranslateModule.forRoot()],
        schemas: [NO_ERRORS_SCHEMA],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(SelectLanguageComponent);
          component = fixture.componentInstance;
          element = fixture.nativeElement;

          const form = new FormGroup({
            preferredLanguage: new FormControl('en_US'),
          });
          component.form = form;

          component.languages = [
            { lang: 'en_US', value: 'en', displayName: 'English' },
            { lang: 'de_DE', value: 'de', displayName: 'Deutsch' },
          ] as Locale[];
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
    expect(component.controlName).toEqual('preferredLanguage', 'control Name should be <preferredLanguage>');
    expect(component.label).toEqual(
      'account.default_address.preferred_language.label',
      'label key should be <account.default_address.preferred_language.label>'
    );
  });

  it('should get and display languages on creation', () => {
    const changes: SimpleChanges = {
      languages: new SimpleChange(null, component.languages, false),
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();
    expect(component.options.length).toEqual(2, '2 languages are in the options array'); // ToDo: languages are retrieved from a service
    expect(element.querySelector('select[data-testing-id=preferredLanguage]')).toBeTruthy();
  });
});
