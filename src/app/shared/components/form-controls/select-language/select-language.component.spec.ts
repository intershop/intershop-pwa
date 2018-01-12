import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito';
import { SelectLanguageComponent } from './select-language.component';

describe('Select Language Component', () => {
  let component: SelectLanguageComponent;
  let fixture: ComponentFixture<SelectLanguageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const translateServiceMock = mock(TranslateService);
    when(translateServiceMock.get(anything())).thenCall((data) => {
      return Observable.of(data);
    });
    TestBed.configureTestingModule({
      declarations: [SelectLanguageComponent],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(SelectLanguageComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          preferredLanguage: new FormControl('en_US')
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
    expect(component.controlName).toEqual('preferredLanguage', 'control Name should be <preferredLanguage>');
    expect(component.label).toEqual('Preferred Language', 'label should be <Preferred Language>');
  });

  it('should get and display languages on creation', () => {
    fixture.detectChanges();
    expect(component.options.length).toEqual(3, '3 languages are in the options array'); // ToDo: languages are retrieved from a service
    expect(element.querySelector('select[data-testing-id=preferredLanguage]')).toBeTruthy('language select is rendered');
  });

});
