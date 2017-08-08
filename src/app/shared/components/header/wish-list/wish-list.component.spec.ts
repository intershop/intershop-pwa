import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { DebugElement, Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WishListComponent } from './wish-list.component';
import { DataEmitterService } from '../../../services/data-emitter.service';
import { WishListPageComponent } from '../../../../pages/wish-list-page/wish-list-page.component';

@Component({
    template: ''
})
class DummyComponent {
}

describe('Wish List Component', () => {
    let fixture: ComponentFixture<WishListComponent>,
        component: WishListComponent,
        element: HTMLElement,
        debugEl: DebugElement,
        translateService: TranslateService;

    beforeEach(() => {
        class DataEmitterServiceStub {
            wishListEmitter = new Observable((observer) => {
                observer.next('item');
            });
        };

        TestBed.configureTestingModule({
            imports: [CommonModule,
                RouterTestingModule.withRoutes([
                    { path: 'wishlist', component: DummyComponent }
                ]),
                TranslateModule.forRoot()
            ],
            providers: [{ provide: DataEmitterService, useClass: DataEmitterServiceStub }, TranslateService],
            declarations: [WishListComponent, DummyComponent]
        }).compileComponents();

        translateService = TestBed.get(TranslateService);
        translateService.setDefaultLang('en');
        translateService.use('en');
        fixture = TestBed.createComponent(WishListComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        debugEl = fixture.debugElement;
    });

    it('should check itemCount is equal to 1', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.itemCount).toBeGreaterThan(0);
    });

    it('should check itemCount on the template to be item', () => {
        component.ngOnInit();
        fixture.detectChanges();
        const itemCount = element.querySelector('#compare-count').textContent;

        expect(itemCount).toBeGreaterThan(0);
    });

    it('should go to URL "wishlist"', async(inject([Router, Location], (router: Router, location: Location) => {
        fixture.detectChanges();
        fixture.debugElement.query(By.css('a')).nativeElement.click();

        fixture.whenStable().then(() => {
            expect(location.path()).toContain('wishlist');
        });
    })));
});
