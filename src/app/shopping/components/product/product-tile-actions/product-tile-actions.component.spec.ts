import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ProductTileActionsComponent } from './product-tile-actions.component';

describe('Product Tile Actions Component', () => {
  let component: ProductTileActionsComponent;
  let fixture: ComponentFixture<ProductTileActionsComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        ProductTileActionsComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileActionsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
