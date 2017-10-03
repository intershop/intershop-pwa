import { Component, Input } from '@angular/core';
import { LocalizeRouterService } from '../../../../services/routes-parser-locale-currency/localize-router.service';
@Component({
  selector: 'is-subcategory-navigation',
  templateUrl: './subcategory-navigation.component.html'
})

export class SubCategoryNavigationComponent {
  @Input() parent;
  @Input() categoryLevel;
  constructor(
    public localizeRouterService: LocalizeRouterService) {
  }
}
