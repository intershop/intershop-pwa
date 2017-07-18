import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WishlistPageComponent } from './wishlistPage.component';

describe('WishlistPageComponent', () => {
  let component: WishlistPageComponent;
  let fixture: ComponentFixture<WishlistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WishlistPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
