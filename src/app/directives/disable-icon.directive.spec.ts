import { DisableIconDirective } from './disable-icon.directive';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { ElementRef, OnInit, Renderer2, Component, ViewChild } from '@angular/core';
import { GlobalState } from '../services/global.state';

describe('DisableIconDirective', () => {
    @Component({
        template: `<div class="is-selected" isDisableIcon [property]="'123'" [globalStateKey]="'productCompareData'">MockComponent</div>`
    })
    class MockComponent implements OnInit {
        @ViewChild(DisableIconDirective) disableIconDirective: DisableIconDirective = null;
        ngOnInit() {
            // tslint:disable-next-line: ban
            this.disableIconDirective.ngOnInit();
        }
    }

    let fixture: ComponentFixture<MockComponent>;
    let component: MockComponent;
    let element: HTMLElement;
    class ElementRefStub {

    }
    class RendererStub {

    }
    class GlobalStatestub {
        subscribeCachedData(key: string, callBack: Function) {
            callBack('some data');
        }
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DisableIconDirective, MockComponent],
            providers: [{ provide: ElementRef, useClass: ElementRefStub },
            { provide: Renderer2, useClass: RendererStub },
            { provide: GlobalState, useClass: GlobalStatestub }
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(MockComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    it('should remove class is-selected', () => {
        const div = fixture.debugElement.nativeElement.firstElementChild;
        fixture.detectChanges();
        expect(div.className).toBe('');
    });
});


