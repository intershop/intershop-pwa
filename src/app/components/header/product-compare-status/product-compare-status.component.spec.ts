import { ProductCompareStatusComponent } from './product-compare-status.component';
import { DebugElement, Component } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalState } from 'app/services';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    template: ''
})
class DummyComponent {
}

describe('Product Compare status Component', () => {
    let fixture;
    let component: ProductCompareStatusComponent;
    let debugEl: DebugElement;

    beforeEach(() => {
        class GlobalStateStub {
            subscribeCachedData(key, callBack: Function) {

            }
        }

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'compare', component: DummyComponent }
                ]),
                TranslateModule.forRoot()
            ],
            declarations: [
                ProductCompareStatusComponent,
                DummyComponent
            ],
            providers: [
                { provide: GlobalState, useClass: GlobalStateStub }
            ],

        }).compileComponents();

        fixture = TestBed.createComponent(ProductCompareStatusComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
    });

    it('should create the product compare status component', () => {
        const app = debugEl.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should go to URL "compare"', inject([Router, Location], (router: Router, location: Location) => {
        fixture.detectChanges();
        debugEl.query(By.css('.compare-status')).nativeElement.click();

        fixture.whenStable().then(() => {
            expect(location.path()).toContain('compare');
        });
    }));
});
