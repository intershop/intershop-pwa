import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from '../../../modules/shared.module';
import { AddressComponent } from './address.component';

describe('Address Component', () => {
    let fixture: ComponentFixture<AddressComponent>;
    let component: AddressComponent;
    let element: HTMLElement;
    let debugEl: DebugElement;

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AddressComponent],
            imports: [SharedModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddressComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should call ngOnInit method', () => {
        expect(component.addressForm).not.toBe(null);
    });

    it('should call valueChanges method of form and verify that the form is invalid', () => {
        component.addressForm.get('address.country').setValue('London');
        expect(component.addressForm.valid).toBe(false);
    });

    it('should call valueChanges method of form and verify that the form is valid', () => {
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
    });

    it('should check if controls are rendered on the HTML', () => {
        const elem = element.getElementsByClassName('form-control');
        expect(elem.length).toBe(13);
        for (let i = 0 ; i <= 8 ; i++) {
            expect(elem[i]).toBeTruthy();
        }
    });
});
