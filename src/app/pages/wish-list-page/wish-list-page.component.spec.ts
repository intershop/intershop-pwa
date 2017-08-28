import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { WishListPageComponent } from './wish-list-page.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';
import { WishListService } from './wish-list-service/wish-list-service';

describe('Wish list Page Component', () => {
  let fixture: ComponentFixture<WishListPageComponent>,
    component: WishListPageComponent,
    element: HTMLElement,
    debugEl: DebugElement;
  class WishListServiceStub {
    getWishList() {
      return Observable.of(null);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot()
      ],
      providers: [
        { provide: WishListService, useClass: WishListServiceStub }
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
    expect(anchorTag).toBeDefined();
  });

  // TODO: the relevance of this test needs to be discussed (counting input fields?)
  it('should check if input fields are rendered on HTML', () => {
    const inputFields = element.getElementsByClassName('form-control');
    expect(inputFields.length).toBe(4);
    expect(inputFields[0]).toBeDefined();
    expect(inputFields[1]).toBeDefined();
    expect(inputFields[2]).toBeDefined();
  });
});
