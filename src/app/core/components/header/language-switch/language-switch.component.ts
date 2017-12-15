import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AVAILABLE_LOCALES } from '../../../configurations/injection-keys';
import { CurrentLocaleService } from '../../../services/locale/current-locale.service';

@Component({
  selector: 'ish-language-switch',
  templateUrl: './language-switch.component.html'
})

export class LanguageSwitchComponent implements OnInit {

  // TODO: is this default really a property of the language switch component or a global configuration
  lang: any;

  constructor(
    @Inject(AVAILABLE_LOCALES) public localizationArray,
    private currentLocaleService: CurrentLocaleService,
    public router: Router
  ) { }

  ngOnInit() {
    // TODO: discussion whether this information is coming from a service or is configured at development time
    this.currentLocaleService.subscribe(locale => {
      this.lang = locale;
    });
  }

  languageChange(locale) {
    this.currentLocaleService.setValue(locale);
    return false; // prevent actual navigation, only change localized values on the current page and set language state
  }
}
