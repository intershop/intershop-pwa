import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core/';
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
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(SelectTitleComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;

      const form = new FormGroup({
        countryCode: new FormControl('BG'),
        title: new FormControl()
      });
      component.form = form;
      component.titles = [
        'account.salutation.ms.text',
        'account.salutation.mr.text',
        'account.salutation.dr.text'
      ];
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('title', 'control Name should be <title>');
    expect(component.label).toEqual('account.default_address.title.label', 'label key should be <account.default_address.title.label>');
  });

  it('should get and display titles for a certain country', () => {
    const changes: SimpleChanges = {
      titles: new SimpleChange(null, component.titles, false)
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();
    expect(component.options.length).toEqual(3, '3 titles are in the options array');
    expect(element.querySelector('select[data-testing-id=title]')).toBeTruthy('title select is rendered');
  });
});
