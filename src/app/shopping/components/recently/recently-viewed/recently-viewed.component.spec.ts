import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { RecentlyViewedComponent } from './recently-viewed.component';

describe('RecentlyViewedComponent', () => {
  let component: RecentlyViewedComponent;
  let fixture: ComponentFixture<RecentlyViewedComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RecentlyViewedComponent,
        MockComponent({ selector: 'ish-product-tile', template: 'Product Tile Component', inputs: ['product'] })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
