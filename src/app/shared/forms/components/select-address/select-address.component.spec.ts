import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { Address } from 'ish-core/models/address/address.model';

import { SelectAddressComponent } from './select-address.component';

describe('Select Address Component', () => {
  let component: SelectAddressComponent;
  let fixture: ComponentFixture<SelectAddressComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAddressComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAddressComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    const form = new FormGroup({
      id: new FormControl(),
      urn: new FormControl(),
    });
    component.controlName = 'id';
    component.form = form;
    component.addresses = [
      { id: '4711', urn: 'urn4711', firstName: 'Patricia' } as Address,
      { id: '4712', urn: 'urn4712', firstName: 'John' } as Address,
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display addresses if component input changes', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();
    expect(component.options).toHaveLength(2);
    expect(element.querySelector('[data-testing-id=id]')).toBeTruthy();
    expect(element.querySelector('option[value="4711"]')).toBeTruthy();
  });

  it('should use urn as value if controlName does not equals id', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(undefined, component.addresses, false),
    };
    component.controlName = 'urn';
    component.ngOnChanges(changes);

    fixture.detectChanges();
    expect(element.querySelector('option[value=urn4711]')).toBeTruthy();
  });
});
