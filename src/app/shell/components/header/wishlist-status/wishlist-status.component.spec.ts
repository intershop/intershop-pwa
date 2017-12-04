import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WishListService } from '../../../../core/services/wishlists/wishlists.service';
import { Wishlist } from '../../../../models/wishlist.model';
import { WishListComponent } from './wishlist-status.component';


describe('Wish List Component', () => {
  let fixture: ComponentFixture<WishListComponent>;
  let component: WishListComponent;
  let element: HTMLElement;
  let wishListServiceMock: BehaviorSubject<Wishlist>;
  let location: Location;

  beforeEach(async(() => {
    wishListServiceMock = new BehaviorSubject({ itemsCount: 1 } as Wishlist);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'wishlist', component: WishListComponent }
        ]),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: WishListService, useValue: wishListServiceMock }
      ],
      declarations: [WishListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WishListComponent);
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
    wishListServiceMock.next({ itemsCount: 0 } as Wishlist);
    fixture.detectChanges();

    const itemCountElement = element.querySelector('#preferred-wishlist-counter');
    expect(itemCountElement).toBeFalsy();
  });

  it('should go to URL "wishlist" when clicked', async(() => {
    expect(location.path()).toBe('');
    element.querySelector('a').click();

    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/wishlist');
    });
  }));
});
