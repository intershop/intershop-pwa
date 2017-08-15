import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiniCartComponent } from './mini-cart.component';
import { DataEmitterService } from '../../../services/data-emitter.service';

describe('Mini Cart Component', () => {
    let fixture: ComponentFixture<MiniCartComponent>,
        component: MiniCartComponent,
        element: HTMLElement,
        debugEl: DebugElement;

    class DataEmitterServiceStub {
        public miniCartEmitter = new Observable((observer) => {
            observer.next({ name: 'testItem', salePrice: { value: 20 } });
            observer.complete();
        });
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MiniCartComponent
            ],
            providers: [{ provide: DataEmitterService, useClass: DataEmitterServiceStub }],
            imports: [],
            schemas: [NO_ERRORS_SCHEMA]
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

        expect(cartPrice).toEqual('$ 20');
        expect(cartLength).toEqual('1 items');
    });
});
