import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, StoreModule } from '@ngrx/store';
import { reducers } from '../../store/shopping.system';
import { ProductTileActionsContainerComponent } from './product-tile-actions.container';

describe('ProductTileActionsContainerComponent', () => {
  let component: ProductTileActionsContainerComponent;
  let fixture: ComponentFixture<ProductTileActionsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(reducers)
        })
      ],
      declarations: [ProductTileActionsContainerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileActionsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
