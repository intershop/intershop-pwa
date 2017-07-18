import { Component, OnInit } from '@angular/core';

import { Category } from '../../services/category';
import { CategoriesService } from '../../services/categories.service';
import { TranslatePipe, TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [CategoriesService]
})
export class HeaderComponent implements OnInit {

  categories: Category[];

  constructor(private categoriesService: CategoriesService, private translate: TranslateService) {
      translate.onLangChange.subscribe((params: LangChangeEvent) => {
       console.log(this.translate.instant('js.message.constructor'));
     });
   }

  ngOnInit() {
    this.getCategories();
  }

  getCategories(): void {
    this.categoriesService.getCategories().then(categories => this.categories = categories);
    this.translate.onLangChange.subscribe((params: LangChangeEvent) => {
      console.log(this.translate.instant('js.message.somewhere'));
    });
  }

}
