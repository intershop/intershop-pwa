import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiniCartComponent } from './mini-cart.component';
import { GlobalState } from '../../../services/global.state';

describe('Mini Cart Component', () => {
    let fixture: ComponentFixture<MiniCartComponent>;
    let component: MiniCartComponent;
    let element: HTMLElement;
    let debugEl: DebugElement;

    class GlobalStateStub {
        subscribeCachedData(key, callBack: Function) {

        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MiniCartComponent
            ],
            providers: [{ provide: GlobalState, useClass: GlobalStateStub }],
            imports: [],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(MiniCartComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should create the component', () => {
        const app = debugEl.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should call calculateCartValues and verify if the correct calculations are made', () => {
        const cartItems = [
            {
                salePrice: {
                    'value': 20
                }
            },
            {
                salePrice: {
                    'value': 40
                }
            },
        ];
        component.calculateCartValues(cartItems);
        expect(component.cartPrice).toEqual(60);
        expect(component.cartLength).toEqual(2);
    });

});
