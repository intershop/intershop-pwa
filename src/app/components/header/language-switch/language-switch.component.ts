import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CurrentLocaleService } from '../../../services/locale/current-locale.service';

@Component({
  selector: 'is-language-switch',
  templateUrl: './language-switch.component.html'
})

export class LanguageSwitchComponent implements OnInit {

  // TODO: is this default realy a property of the language switch component or a global configuration
  lang: any;
  localizationArray: any;

  constructor(private currentLocaleService: CurrentLocaleService, public router: Router) {
  }

  ngOnInit() {
    // TODO: discussion whether this information is coming from a service or is configured at development time
    this.localizationArray = environment.locales;
  }

  languageChange(locale) {
    this.lang = locale;
    this.currentLocaleService.setLang(locale.lang);
    return false;
  }
}
