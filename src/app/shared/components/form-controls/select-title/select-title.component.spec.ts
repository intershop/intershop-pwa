import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { anything, instance, mock, when } from 'ts-mockito';
import { SelectTitleComponent } from './select-title.component';

describe('Select Title Component', () => {
  let component: SelectTitleComponent;
  let fixture: ComponentFixture<SelectTitleComponent>;
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

    TestBed.configureTestingModule({
      declarations: [SelectTitleComponent],
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateServiceMock) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(SelectTitleComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        const form = new FormGroup({
          countryCode: new FormControl('BG'),
          title: new FormControl()
        });
        component.form = form;
        component.countryCode = 'BG';
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('title', 'control Name should be <title>');
    expect(component.label).toEqual('Salutation', 'label should be <Salutation>');
  });

  it('should throw an error if input parameter countryCode is not set', () => {
    component.countryCode = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  it('should get and display titles for a certain country', () => {
    component.ngOnChanges({
      name: new SimpleChange(null, 'BG', true)
    });

    fixture.detectChanges();
    expect(component.options.length).toEqual(3, '3 titles are in the options array'); // ToDo: Adapt test if title service is active
    expect(element.querySelector('select[data-testing-id=title]')).toBeTruthy('title select is rendered');
  });
});
