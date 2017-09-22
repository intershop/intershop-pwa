import { Component } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { SharedModule } from '../../../modules/shared.module';
import { DataEmitterService } from '../../../services/data-emitter.service';
import { WishListComponent } from './wishlist-status.component';

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
