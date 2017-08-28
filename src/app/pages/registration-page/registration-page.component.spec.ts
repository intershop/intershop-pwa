import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { RegistrationPageComponent } from './registration-page.component';
import { Router } from '@angular/router';
import { MockComponent } from 'app/components/mock.component';

describe('RegistrationPage Component', () => {
    let fixture: ComponentFixture<RegistrationPageComponent>,
        component: RegistrationPageComponent,
        element: HTMLElement,
        debugEl: DebugElement

    class RouterStub {
        navigate(url) {
            return url;
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegistrationPageComponent,
                MockComponent({ selector: 'is-email-password', template: 'Email Template' }),
                MockComponent({ selector: 'is-address', template: 'Address Template' }),
                MockComponent({ selector: 'is-captcha', template: 'Captcha Template' }),
            ],
            providers: [{ provide: Router, useClass: RouterStub }]
        })
            .compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistrationPageComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    })

    it('should call cancelClicked method', (inject([Router], (router: Router) => {
        const spy = spyOn(router, 'navigate');
        component.cancelClicked();
        expect(spy).toHaveBeenCalledWith(['']);
    })
    ))

    it('should check if controls are getting rendered on the page', () => {
        expect(element.getElementsByTagName('h1')[0].innerHTML).toEqual('Create a New Account');
        expect(element.getElementsByTagName('is-email-password')[0].innerHTML).toEqual('Email Template');
        expect(element.getElementsByTagName('is-captcha')[0].innerHTML).toEqual('Captcha Template');
        expect(element.getElementsByTagName('is-address')[0].innerHTML).toEqual('Address Template');
    })

});
