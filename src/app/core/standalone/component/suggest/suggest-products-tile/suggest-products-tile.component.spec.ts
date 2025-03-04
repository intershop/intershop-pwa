import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { SuggestProductsTileComponent } from './suggest-products-tile.component';

describe('Suggest Products Tile Component', () => {
  let component: SuggestProductsTileComponent;
  let fixture: ComponentFixture<SuggestProductsTileComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestProductsTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.maxAutoSuggests = 2;
    component.deviceType = 'desktop';
    component.products = [
      {
        name: 'Product 1',
        shortDescription: 'Product 1 short desc',
        longDescription: 'Product 1 long desc',
        minOrderQuantity: 1,
        maxOrderQuantity: 10,
        stepQuantity: 1,
        manufacturer: 'Manufacturer 1',
        roundedAverageRating: 0,
        numberOfReviews: 0,
        readyForShipmentMax: 0,
        readyForShipmentMin: 0,
        packingUnit: 'piece',
        type: 'Product',
        available: true,
        images: [
          {
            effectiveUrl: 'http://domain.com/M/3538322-4095.jpg',
            name: 'front M',
            primaryImage: true,
            type: 'Image',
            typeID: 'M',
            viewID: 'front',
            imageActualHeight: 270,
            imageActualWidth: 270,
          },
        ],
        attributes: [
          {
            name: 'primaryImageId',
            value: 'M/3538322-4095.jpg',
          },
          {
            name: 'supplier-sku',
            value: '12345',
          },
        ],
        sku: '3538322',
        completenessLevel: 0,
        failed: false,
        promotionIds: [],
      },
    ];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the correct number of product suggestions', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('li')).toHaveLength(1);
  });
});
