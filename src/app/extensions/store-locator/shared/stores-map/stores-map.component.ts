import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

import { StoreLocatorFacade } from '../../facades/store-locator.facade';

@Component({
  selector: 'ish-stores-map',
  templateUrl: './stores-map.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class StoresMapComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer: ElementRef;

  constructor(private storeLocatorFacade: StoreLocatorFacade) {}

  ngAfterViewInit() {
    this.storeLocatorFacade.loadMap(this.mapContainer.nativeElement);
  }
}
