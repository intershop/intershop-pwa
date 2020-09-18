import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { SelectTitleComponent } from './select-title.component';

describe('Select Title Component', () => {
  let component: SelectTitleComponent;
  let fixture: ComponentFixture<SelectTitleComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FormControlFeedbackComponent),
        MockDirective(ShowFormFeedbackDirective),
        SelectTitleComponent,
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTitleComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const form = new FormGroup({
      countryCode: new FormControl('BG'),
      title: new FormControl(),
    });
    component.form = form;
    component.titles = ['account.salutation.ms.text', 'account.salutation.mr.text', 'account.salutation.dr.text'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('title');
    expect(component.label).toEqual('account.default_address.title.label');
  });

  it('should get and display titles for a certain country', () => {
    const changes: SimpleChanges = {
      titles: new SimpleChange(undefined, component.titles, false),
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();
    expect(component.options).toHaveLength(3);
    expect(element.querySelector('[data-testing-id=title]')).toBeTruthy();
  });
});
