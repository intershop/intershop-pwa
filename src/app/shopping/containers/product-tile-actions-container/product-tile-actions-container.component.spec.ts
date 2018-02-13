import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTileActionsContainerComponent } from './product-tile-actions-container.component';

describe('ProductTileActionsContainerComponent', () => {
  let component: ProductTileActionsContainerComponent;
  let fixture: ComponentFixture<ProductTileActionsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTileActionsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileActionsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
