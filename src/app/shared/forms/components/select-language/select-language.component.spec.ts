import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { Locale } from 'ish-core/models/locale/locale.model';
import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { SelectLanguageComponent } from './select-language.component';

describe('Select Language Component', () => {
  let component: SelectLanguageComponent;
  let fixture: ComponentFixture<SelectLanguageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(FormControlFeedbackComponent),
        MockDirective(ShowFormFeedbackDirective),
        SelectLanguageComponent,
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
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
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('preferredLanguage');
    expect(component.label).toEqual('account.default_address.preferred_language.label');
  });

  it('should get and display languages on creation', () => {
    const changes: SimpleChanges = {
      languages: new SimpleChange(undefined, component.languages, false),
    };
    component.ngOnChanges(changes);
    fixture.detectChanges();
    expect(component.options).toHaveLength(2); // ToDo: languages are retrieved from a service
    expect(element.querySelector('[data-testing-id=preferredLanguage]')).toBeTruthy();
  });
});
