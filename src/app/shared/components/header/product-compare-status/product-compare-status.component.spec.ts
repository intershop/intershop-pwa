import { DebugElement, Component } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { ProductCompareStatusComponent } from './product-compare-status.component';
import { DataEmitterService } from '../../../services/data-emitter.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../../shared/shared-modules/shared.module';

@Component({
    template: ''
})
class DummyComponent {
}

describe('Product Compare Component', () => {
    let fixture,
        component: ProductCompareStatusComponent,
        debugEl: DebugElement;
    let translateService: TranslateService;
    beforeEach(() => {
        class DataEmitterServiceStub {
            public comparerListEmitter = new Observable((observer) => {
                observer.next('1234');
                observer.complete();
            });
        };

        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                RouterTestingModule.withRoutes([
                    { path: 'compare', component: DummyComponent }
                ]),
                TranslateModule.forRoot()
            ],
            declarations: [
                ProductCompareStatusComponent,
                DummyComponent
            ],
            providers: [{ provide: DataEmitterService, useClass: DataEmitterServiceStub }, TranslateService]
        }).compileComponents();

        translateService = TestBed.get(TranslateService);
        translateService.setDefaultLang('en');
        translateService.use('en');

        fixture = TestBed.createComponent(ProductCompareStatusComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
    });

    it('should create the component', async(() => {
        const app = debugEl.componentInstance;
        expect(app).toBeTruthy();
    }));

    it('should check number of items is greater than 0', () => {
        component.ngOnInit();
        expect(component.compareListItems.length).toBeGreaterThan(0);
    });

    it('should remove the already pushed data', () => {
        expect(component.compareListItems.length).toBe(0);
    });

    it('should go to URL "familyPage/compare/1" ', async(inject([Router, Location], (router: Router, location: Location) => {
        fixture.detectChanges();
        debugEl.query(By.css('.compare-status')).nativeElement.click();

        fixture.whenStable().then(() => {
            expect(location.path()).toContain('compare');
        });
    })));
});
