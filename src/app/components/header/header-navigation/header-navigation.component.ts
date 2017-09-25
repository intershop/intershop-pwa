import { Component, Input } from '@angular/core';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';
@Component({
  selector: 'is-header-navigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent {
  @Input() allCategories;
  constructor(public localize: LocalizeRouterService) { }
}
