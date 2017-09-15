import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WishListComponent } from './wishlist-status.component';
import { DataEmitterService } from '../../../services/data-emitter.service';
import { SharedModule } from '../../../modules/shared.module';

@Component({
    template: ''
})
class DummyComponent {
}

xdescribe('Wish List Component', () => {
    let fixture: ComponentFixture<WishListComponent>;
    let component: WishListComponent;
    let element: HTMLElement;
    let translateService: TranslateService;

    beforeEach(() => {
        class DataEmitterServiceStub {
            wishListEmitter = new Observable((observer) => {
                observer.next('item');
            });
        }

        TestBed.configureTestingModule({
            imports: [
                SharedModule,
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
        fixture.detectChanges();
    });

    it('should check itemCount is equal to 1', () => {
        expect(component.itemCount).toBeGreaterThan(0);
    });

    it('should check itemCount on the template to be item', () => {
        const itemCount = element.querySelector('#compare-count').textContent;

        expect(itemCount).toBeGreaterThan(0);
    });

    it('should go to URL "wishlist"', async(inject([Router, Location], (router: Router, location: Location) => {
        element.querySelector('a').click();

        fixture.whenStable().then(() => {
            expect(location.href).toContain('wishlist');
        });
    })));
});
