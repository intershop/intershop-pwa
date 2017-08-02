import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { AddressComponent } from './address.component';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

describe('Address Component', () => {
    let fixture: ComponentFixture<AddressComponent>,
        component: AddressComponent,
        element: HTMLElement,
        debugEl: DebugElement

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddressComponent],
            imports: [ReactiveFormsModule]
        })
            .compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(AddressComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    })

    it('should call ngOnInit method', () => {
        component.ngOnInit();
        expect(component.addressForm).not.toBe(null);
    })

    it('should call valueChanges method of form and verify that the form is invalid', () => {
        component.ngOnInit();
        component.addressForm.get('address.country').setValue('London');
        expect(component.addressForm.valid).toBe(false);
    })

    it('should call valueChanges method of form and verify that the form is valid', () => {
        component.ngOnInit();
        component.addressForm.get('address.country').setValue('London');
        component.addressForm.get('address.firstName').setValue('Patricia');
        component.addressForm.get('address.lastName').setValue('Miller');
        component.addressForm.get('address.line1').setValue('BullStreet');
        component.addressForm.get('address.line2').setValue('Ohio');
        component.addressForm.get('address.zip').setValue('132114');
        component.addressForm.get('address.city').setValue('London');
        component.addressForm.get('address.phone').setValue('1234567890');
        component.addressForm.get('address.preferredLanguage').setValue('English');
        component.addressForm.get('address.birthday').setValue('18/07/1993');
        component.addressForm.get('address.state').setValue('California');
        expect(component.addressForm.valid).toBe(true);
    })

    it('should check if controls are rendered on the HTML', () => {
        const elem = element.getElementsByClassName('form-control');
        expect(elem.length).toBe(13);
        expect(elem[0]).toBeDefined();
        expect(elem[1]).toBeDefined();
        expect(elem[2]).toBeDefined();
        expect(elem[3]).toBeDefined();
        expect(elem[4]).toBeDefined();
        expect(elem[5]).toBeDefined();
        expect(elem[6]).toBeDefined();
        expect(elem[7]).toBeDefined();
        expect(elem[8]).toBeDefined();
    })

});
