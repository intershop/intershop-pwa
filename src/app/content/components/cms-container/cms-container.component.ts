import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ContentPageletView } from '../../../models/content-view/content-views';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-container',
  templateUrl: './cms-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSContainerComponent implements OnInit {
  @Input()
  pagelet: ContentPageletView;

  contentSlotPagelets: ContentPageletView[] = [];
  containerClasses = '';

  ngOnInit() {
    let contentSlotPagelets = this.pagelet.slot('app_sf_responsive_cm:slot.container.content.pagelet2-Slot').pagelets();
    if (this.pagelet.hasParam('UpperBound')) {
      contentSlotPagelets = contentSlotPagelets.slice(0, this.pagelet.numberParam('UpperBound'));
    }
    this.contentSlotPagelets = contentSlotPagelets;

    this.containerClasses = this.getGridCSS(this.pagelet.stringParam('Grid'));
    this.containerClasses += this.pagelet.stringParam('CSSClass', '');
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
