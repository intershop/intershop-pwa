import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { LogoComponent } from './logo.component';

describe('Logo Component', () => {
    let fixture: ComponentFixture<LogoComponent>,
        component: LogoComponent,
        element: HTMLElement,
        debugEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                LogoComponent
            ],
            providers: [],
            imports: []
        });

        fixture = TestBed.createComponent(LogoComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should check whether logo image is rendered or not', () => {
        expect(element.querySelector('img')).toBeDefined();
    });
});
