import {Component, OnInit} from '@angular/core'
import {HeaderNavigationService} from './headerNavigationService/headerNavigation.service';
import {HeaderNavigationCategoryModel} from './headerNavigationService/headerNavigationCategory.model';
import {HeaderNavigationSubcategoryModel} from './headerNavigationService/headerNavigationSubcategory.model';
import * as _ from 'lodash';
import {forEach} from '@angular/router/src/utils/collection';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'is-headernavigation',
  templateUrl: './headerNavigation.component.html'
})

export class HeaderNavigationComponent implements OnInit {

  categories: HeaderNavigationCategoryModel;
  subCategories: HeaderNavigationSubcategoryModel;

  findSubcategories(id: string) {
    const p = _.find(this.subCategories.elements, (o) => o.id === id);
    if (p && p.subCategories) {
      return p.subCategories;
    }
  }

  ngOnInit() {
    Observable.forkJoin([HeaderNavigationService.getCategories(), HeaderNavigationService.getSubCategories()]).subscribe((headerData) => {
      this.categories = headerData[0];
      this.subCategories = headerData[1];

      for (const p of this.categories.elements) {
        p.subCategories = this.findSubcategories(p.name);
      }
    });
  }
}
