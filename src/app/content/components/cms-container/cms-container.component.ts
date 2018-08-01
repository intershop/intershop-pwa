import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ContentPageletHelper } from '../../../models/content-pagelet/content-pagelet.helper';
import { ContentPagelet } from '../../../models/content-pagelet/content-pagelet.model';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-container',
  templateUrl: './cms-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSContainerComponent implements OnInit {
  @Input()
  pagelet: ContentPagelet;

  contentSlotPagelets: ContentPagelet[] = [];
  containerClasses = '';

  getConfigurationParameterValue = ContentPageletHelper.getConfigurationParameterValue;

  ngOnInit() {
    const upperBound = this.getConfigurationParameterValue(this.pagelet, 'UpperBound', 'number');
    this.contentSlotPagelets = upperBound
      ? this.pagelet.slots['app_sf_responsive_cm:slot.container.content.pagelet2-Slot'].pagelets.slice(0, upperBound)
      : this.pagelet.slots['app_sf_responsive_cm:slot.container.content.pagelet2-Slot'].pagelets;

    this.containerClasses = this.getGridCSS(this.getConfigurationParameterValue(this.pagelet, 'Grid'));
    this.containerClasses += this.getConfigurationParameterValue(this.pagelet, 'CSSClass')
      ? this.getConfigurationParameterValue(this.pagelet, 'CSSClass')
      : '';
  }

  getGridCSS(grid: string): string {
    let gridCSS = '';

    // transform an incomming string like "ExtraSmall:12,Small:6,Medium:4,Large:0" to a grid object
    const gridObject = { ExtraSmall: 0, Small: 0, Medium: 0, Large: 0 };
    grid.split(',').map(element => {
      gridObject[element.split(':')[0]] = Number(element.split(':')[1]);
    });

    // the 'hidden-__' classes replacement is not 100% compatible to Bootstrap 3
    if (gridObject.ExtraSmall !== 0) {
      gridCSS += gridObject.ExtraSmall !== -1 ? `col-${gridObject.ExtraSmall} ` : 'd-none d-md-block ';
    }
    if (gridObject.Small !== 0) {
      gridCSS += gridObject.Small !== -1 ? `col-md-${gridObject.Small} ` : 'd-md-none d-lg-block ';
    }
    if (gridObject.Medium !== 0) {
      gridCSS += gridObject.Medium !== -1 ? `col-lg-${gridObject.Medium} ` : 'd-lg-none d-xl-block ';
    }
    if (gridObject.Large !== 0) {
      gridCSS += gridObject.Large !== -1 ? `col-xl-${gridObject.Large} ` : 'd-xl-none ';
    }

    // 'float-left' is added to get the similar styling as with Bootstrap 3
    if (gridCSS !== '') {
      gridCSS += 'float-left ';
    }

    return gridCSS;
  }
}
