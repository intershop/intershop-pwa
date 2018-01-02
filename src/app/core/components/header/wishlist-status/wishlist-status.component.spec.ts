import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Wishlist } from '../../../../models/wishlist.model';
import { WishlistsService } from '../../../services/wishlists/wishlists.service';
import { WishlistComponent } from './wishlist-status.component';


describe('Wish List Component', () => {
  let fixture: ComponentFixture<WishlistComponent>;
  let component: WishlistComponent;
  let element: HTMLElement;
  let wishlistsServiceMock$: BehaviorSubject<Wishlist>;
  let location: Location;

  beforeEach(async(() => {
    wishlistsServiceMock$ = new BehaviorSubject({ itemsCount: 1 } as Wishlist);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'account/wishlist', component: WishlistComponent }
        ]),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: WishlistsService, useValue: wishlistsServiceMock$ }
      ],
      declarations: [WishlistComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    location = TestBed.get(Location);

    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
  });

  it('should have itemCount of 1 when mock data supplies 1', () => {
    expect(component.itemCount).toBe(1);
  });

  it('should display itemCount of 1 when mock data supplies 1', () => {
    const itemCount = element.querySelector('#preferred-wishlist-counter').textContent;

    expect(itemCount).toBe('1');
  });

  it('should not display counter when item count is 0', () => {
    wishlistsServiceMock$.next({ itemsCount: 0 } as Wishlist);
    fixture.detectChanges();

    const itemCountElement = element.querySelector('#preferred-wishlist-counter');
    expect(itemCountElement).toBeFalsy();
  });

  it('should go to URL "/account/wishlist" when clicked', async(() => {
    expect(location.path()).toBe('');
    element.querySelector('a').click();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/account/wishlist');
    });
  }));
});
