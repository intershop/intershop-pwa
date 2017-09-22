import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';
import { instance, mock} from 'ts-mockito';
import { GlobalState } from '../../services';
import { WishListService } from '../../services/wishlists/wishlists.service';
import { WishListPageComponent } from './wishlists-page.component';

describe('Wish list Page Component', () => {
  let fixture: ComponentFixture<WishListPageComponent>;
  let component: WishListPageComponent;
  let element: HTMLElement;
  let debugEl: DebugElement;
  class WishListServiceStub {
    getWishList() {
      return Observable.of(null);
    }
  }

  beforeEach(async(() => {
    const globalStateMock = mock(GlobalState);
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot()
      ],
      providers: [
        { provide: WishListService, useClass: WishListServiceStub },
        { provide: GlobalState, useFactory: () => instance(globalStateMock) }
      ],
      declarations: [WishListPageComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(WishListPageComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      debugEl = fixture.debugElement;
    });
  }));

  it('should check if "Add to Wishlist" button is rendered', () => {
    const anchorTag = element.querySelector('.btn-default');
    expect(anchorTag).toBeTruthy();
  });

  // TODO: the relevance of this test needs to be discussed (counting input fields?)
  it('should check if input fields are rendered on HTML', () => {
    const inputFields = element.getElementsByClassName('form-control');
    expect(inputFields.length).toBe(4);
    expect(inputFields[0]).toBeTruthy();
    expect(inputFields[1]).toBeTruthy();
    expect(inputFields[2]).toBeTruthy();
  });
});
