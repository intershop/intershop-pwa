import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { WishlistFacade } from 'ish-core/facades/wishlist.facade';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { WishlistPageComponent } from './wishlist-page.component';

describe('Wishlist Page Component', () => {
  let component: WishlistPageComponent;
  let fixture: ComponentFixture<WishlistPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(ErrorMessageComponent), WishlistPageComponent],
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
          provide: WishlistFacade,
          useValue: {
            loadWishlist: jasmine.createSpy('loadWishlist').and.returnValue(of(undefined)),
            wishlist$: of(undefined),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
