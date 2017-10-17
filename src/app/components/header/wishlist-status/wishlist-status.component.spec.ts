import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { instance, mock } from 'ts-mockito';
import { verify } from 'ts-mockito/lib/ts-mockito';
import { SharedModule } from '../../../modules/shared.module';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
import { WishListModel } from '../../../services/wishlists/wishlists.model';
import { WishListService } from '../../../services/wishlists/wishlists.service';
import { WishListComponent } from './wishlist-status.component';


describe('Wish List Component', () => {
  let fixture: ComponentFixture<WishListComponent>;
  let component: WishListComponent;
  let element: HTMLElement;
  let wishListServiceMock: BehaviorSubject<WishListModel>;
  let localizeRouterServiceMock: LocalizeRouterService;

  beforeEach(() => {
    wishListServiceMock = new BehaviorSubject({itemsCount: 1} as WishListModel);
    localizeRouterServiceMock = mock(LocalizeRouterService);

    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule.withRoutes([
          { path: 'wishlist', redirectTo: 'fakePath' }
        ]),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: WishListService, useValue: wishListServiceMock },
        { provide: LocalizeRouterService, useFactory: () => instance(localizeRouterServiceMock) }
      ],
      declarations: [WishListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have itemCount of 1 when mock data supplies 1', () => {
    expect(component.itemCount).toBe(1);
  });

  it('should display itemCount of 1 when mock data supplies 1', () => {
    const itemCount = element.querySelector('#compare-count').textContent;

    expect(itemCount).toBe('1');
  });

  it('should not display counter when item count is 0', () => {
    wishListServiceMock.next({itemsCount: 0} as WishListModel);
    fixture.detectChanges();

    const itemCountElement = element.querySelector('#compare-count');
    expect(itemCountElement).toBeFalsy();
  });

  it('should go to URL "wishlist" when clicked', () => {
    element.querySelector('a').click();

    fixture.whenStable().then(() => {
      verify(localizeRouterServiceMock.navigateToRoute('/wishlist')).once();
    });
  });
});
