import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { CaptchaComponent } from './captcha.component';
import { RecaptchaModule } from 'ng-recaptcha';

describe('Captcha Component', () => {
    let fixture: ComponentFixture<CaptchaComponent>,
        component: CaptchaComponent,
        element: HTMLElement,
        debugEl: DebugElement

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CaptchaComponent],
            imports: [RecaptchaModule.forRoot()]
        })
            .compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(CaptchaComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
        fixture.detectChanges();
    })

    it('should call resolved method', () => {
        component.resolved('Resolved')
        component.isValid.subscribe(data => {
            expect(data).toBe(true);
        })
    })

    it('should check if controls are rendered on the HTML', () => {
        const elem = element.getElementsByClassName('form-group');
        expect(elem[0].innerHTML).toContain('re-captcha');
    })

});
