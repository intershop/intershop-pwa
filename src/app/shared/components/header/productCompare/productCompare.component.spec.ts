import { DebugElement, Component } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { ProductCompareComponent } from './productCompare.component';
import { DataEmitterService } from '../../../services/dataEmitter.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';

@Component({
    template: ''
})
class DummyComponent {
}

describe('Product Compare Component', () => {
    let fixture: ComponentFixture<ProductCompareComponent>,
        component: ProductCompareComponent,
        element: HTMLElement,
        debugEl: DebugElement;

    beforeEach(() => {
        class DataEmitterServiceStub {
            public comparerListEmitter = new Observable((observer) => {
                observer.next('item');
                observer.complete();
            });
        };

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'familyPage/compare/1', component: DummyComponent }
                ])
            ],
            declarations: [
                ProductCompareComponent,
                DummyComponent
            ],
            providers: [{ provide: DataEmitterService, useClass: DataEmitterServiceStub }]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductCompareComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        element = fixture.nativeElement;
    });

    it('should check itemCount is greater than 0', () => {
        component.ngOnInit();

        expect(component.itemCount).toBeGreaterThan(0);
    });

    it('should go to URL "familyPage/compare/1" ', async(inject([Router, Location], (router: Router, location: Location) => {
        fixture.detectChanges();
        fixture.debugElement.query(By.css('.hidden-xs')).nativeElement.click();

        fixture.whenStable().then(() => {
            expect(location.path()).toContain('familyPage/compare/1');
        });
    })));
});
