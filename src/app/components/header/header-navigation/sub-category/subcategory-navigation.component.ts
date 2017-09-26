import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../../services/categories/categories.service';
import { LocalizeRouterService } from '../../../../services/routes-parser-locale-currency/localize-router.service';
@Component({
  selector: 'is-subcategory-navigation',
  templateUrl: './subcategory-navigation.component.html',
  styles: [`
  ul.category-level1 > li.dropdown{
    background:none;
  }
  @media (max-width: 767px){
    ul.category-level1 > li.open ul{
     display:block;
    }
     ul.category-level1 > li > a {
      width:85%;
      float:left;
      clear:initial;
      }
       ul.category-level1 > li a.dropdown-toggle{
         color:#959595;
        width:15%;
        float:left;
        border-left: 1px solid #ccc;
      }
      ul.category-level1 > li a.dropdown-toggle > span.glyphicon-plus:before{
        content:"+";
      }
    }
  `]
})

export class SubCategoryNavigationComponent {
  @Input() parent;
  @Input() categoryLevel;
  constructor(private router: Router,
    public localize: LocalizeRouterService, private categoriesService: CategoriesService) {
  }

  navigate(subCategory) {
    this.categoriesService.setCurrentCategory(subCategory);
    const navigationPath = subCategory.uri.split('/categories')[1];
    this.router.navigate([this.localize.translateRoute('/category/' + navigationPath)]);
  }
}
