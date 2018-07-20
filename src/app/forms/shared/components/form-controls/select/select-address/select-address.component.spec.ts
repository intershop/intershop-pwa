import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Address } from '../../../../../../models/address/address.model';
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
      addressId: new FormControl(),
    });
    component.controlName = 'addressId';
    component.form = form;
    component.addresses = [
      { id: '4711', firstName: 'Patricia' } as Address,
      { id: '4712', firstName: 'John' } as Address,
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display addresses if component input changes', () => {
    const changes: SimpleChanges = {
      addresses: new SimpleChange(null, component.addresses, false),
    };
    component.ngOnChanges(changes);

    fixture.detectChanges();
    expect(component.options).toHaveLength(2);
    expect(element.querySelector('select[data-testing-id=addressId]')).toBeTruthy();
  });
});
