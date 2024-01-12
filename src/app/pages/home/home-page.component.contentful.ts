// Example component made by Fenego NV (https://www.fenego.be/)

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ContentfulFacade } from 'src/app/extensions/contentful/facades/contentful.facade';
import { Banner } from 'src/app/extensions/contentful/models/banner.model';
import { Category, CategoryItem } from 'src/app/extensions/contentful/models/category.model';
import { ContentfulComponent } from 'src/app/extensions/contentful/models/contentfulComponent.model';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { generateCategoryUrl } from 'ish-core/routing/category/category.route';

@Component({
  selector: 'ish-home-page',
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  bannerData$: Observable<Banner>;
  categories$: Observable<Category[]>;
  productSkus$: Observable<string[]>;
  properties = { variations: false };

  constructor(private contentfulFacade: ContentfulFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    //Banner
    this.bannerData$ = this.contentfulFacade
      .getContent('carousel')
      .pipe(map((data: ContentfulComponent[]) => data[0].fields.carouselItems[0].fields as Banner));

    //Categories
    this.categories$ = this.contentfulFacade
      .getContent('column')
      .pipe(map((data: ContentfulComponent[]) => data[0].fields.items.map(item => item.fields as Category)));

    //Featured products
    this.productSkus$ = this.contentfulFacade
      .getContent('productList')
      .pipe(map((data: ContentfulComponent[]) => data[0].fields as string[]));
  }

  //Get the category link from the deepest subcategory
  navigateToCategoryPage(categoryItem: CategoryItem) {
    let category = categoryItem;
    let categoryString = category.category_id;
    while (category.subcategories.length === 1) {
      category = category.subcategories[0];
      categoryString += `.${category.category_id}`;
    }
    return this.shoppingFacade.category$(categoryString).pipe(map(data => generateCategoryUrl(data)));
  }
}
