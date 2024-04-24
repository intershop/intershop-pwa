import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { WishlistsFacade } from '../../facades/wishlists.facade';

import { SharedWishlistPageComponent } from './shared-wishlist-page.component';

describe('Shared Wishlist Page Component', () => {
  let component: SharedWishlistPageComponent;
  let fixture: ComponentFixture<SharedWishlistPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(ErrorMessageComponent), SharedWishlistPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' }),
            queryParams: of({ owner: 'testOwner', secureCode: 'testSecureCode' }),
            snapshot: {
              paramMap: convertToParamMap({ id: 'testId' }),
              queryParamMap: convertToParamMap({ owner: 'testOwner', secureCode: 'testSecureCode' }),
            },
          },
        },
        {
          provide: WishlistsFacade,
          useValue: {
            loadSharedWishlist: jasmine.createSpy('loadSharedWishlist').and.returnValue(of(undefined)),
            wishlist$: of(undefined),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedWishlistPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
