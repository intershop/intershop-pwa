import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTileActionsComponent } from './product-tile-actions.component';

describe('ProductTileActionsComponent', () => {
  let component: ProductTileActionsComponent;
  let fixture: ComponentFixture<ProductTileActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTileActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
