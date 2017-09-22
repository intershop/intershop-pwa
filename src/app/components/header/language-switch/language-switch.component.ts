import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import { CurrentLocaleService } from '../../../services/locale/current-locale.service';
import { LocalizeRouterService } from '../../../services/routes-parser-locale-currency/localize-router.service';

@Component({
  selector: 'is-language-switch',
  templateUrl: './language-switch.component.html'
})

export class LanguageSwitchComponent implements OnInit {

  // TODO: is this default realy a property of the language switch component or a global configuration
  lang = 'en';

  localizationArray: any;

  constructor(public localize: LocalizeRouterService, private currentLocaleService: CurrentLocaleService, public router: Router) {
  }

  ngOnInit() {
    // TODO: discussion whether this information is coming from a service or is configured at development time
    this.localizationArray = environment.locales;
    this.currentLocaleService.setLang(this.localize.parser.currentLocale.lang);
    this.lang = _.find(environment.locales, (p) => {
      return (p.lang === this.localize.parser.currentLang);
    }).displayValue;
  }

  languageChange(locale) {
    this.lang = locale.displayValue;
    this.localize.changeLanguage(locale).subscribe(p =>
      this.currentLocaleService.setLang(this.localize.parser.currentLocale.lang)
    );
    return false;
  }
}
