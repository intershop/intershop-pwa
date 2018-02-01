import { NO_ERRORS_SCHEMA } from '@angular/core/';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectTitleComponent } from './select-title.component';

describe('Select Title Component', () => {
  let component: SelectTitleComponent;
  let fixture: ComponentFixture<SelectTitleComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectTitleComponent],
      imports: [
        TranslateModule.forRoot()
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
    expect(component.label).toEqual('account.default_address.title.label', 'label key should be <account.default_address.title.label>');
  });

  it('should throw an error if input parameter countryCode is not set', () => {
    component.countryCode = null;
    expect(function() { fixture.detectChanges(); }).toThrow();
  });

  xit('should get and display titles for a certain country', () => {
    fixture.detectChanges();
    expect(component.options.length).toEqual(3, '3 titles are in the options array'); // ToDo: Adapt test if title service is active
    expect(element.querySelector('select[data-testing-id=title]')).toBeTruthy('title select is rendered');
  });
});
