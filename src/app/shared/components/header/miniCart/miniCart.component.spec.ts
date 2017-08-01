import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiniCartComponent } from './miniCart.component';
import { DataEmitterService } from '../../../services/dataEmitter.service';

describe('Mini Cart Component', () => {
    let fixture: ComponentFixture<MiniCartComponent>,
        component: MiniCartComponent,
        element: HTMLElement,
        debugEl: DebugElement;

    class DataEmitterServiceStub {
        public miniCartEmitter = new Observable((observer) => {
            observer.next({ name: 'testItem', listPrice: { value: 20 } });
            observer.complete();
        });
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MiniCartComponent
            ],
            providers: [{ provide: DataEmitterService, useClass: DataEmitterServiceStub }],
            imports: []
        }).compileComponents();

        fixture = TestBed.createComponent(MiniCartComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should check mini cart has item in it', () => {
        component.ngOnInit();

        expect(component.cartLength).toBeGreaterThan(0);
    });

    it('should confirm that cartLength and cartPrice is shown on template', () => {
        fixture.detectChanges();

        const cartPrice = element.getElementsByClassName('mini-cart-price')[0].textContent;
        const cartLength = element.getElementsByClassName('js-cart-count')[0].nextElementSibling.textContent;

        expect(cartPrice).toEqual('$20.00');
        expect(cartLength).toEqual('1 items');
    });
});
