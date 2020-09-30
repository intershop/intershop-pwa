import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FormControlFeedbackComponent } from 'ish-shared/forms/components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from 'ish-shared/forms/directives/show-form-feedback.directive';

import { SelectRegionComponent } from './select-region.component';

describe('Select Region Component', () => {
  let component: SelectRegionComponent;
  let fixture: ComponentFixture<SelectRegionComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(FormControlFeedbackComponent),
        MockDirective(ShowFormFeedbackDirective),
        SelectRegionComponent,
      ],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRegionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const form = new FormGroup({
      countryCode: new FormControl('BG'),
      state: new FormControl('Region1', [Validators.required]),
    });
    component.form = form;
    component.regions = [
      { countryCode: 'BG', regionCode: '02', name: 'Burgas', id: 'BG02' },
      { countryCode: 'BG', regionCode: '23', name: 'Sofia', id: 'BG23' },
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should set default values properly on creation', () => {
    fixture.detectChanges();
    expect(component.controlName).toEqual('state');
    expect(component.label).toEqual('account.default_address.state.label');
  });

  it('should get and display regions for a certain country', () => {
    const changes: SimpleChanges = {
      regions: new SimpleChange(undefined, component.regions, false),
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();
    expect(component.options).toHaveLength(2);
    expect(element.querySelector('[data-testing-id=state]')).toBeTruthy();
  });
});
