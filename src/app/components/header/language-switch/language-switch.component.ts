import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'is-language-switch',
  templateUrl: './language-switch.component.html'
})

export class LanguageSwitchComponent implements OnInit {

  // TODO: is this default realy a property of the language switch component or a global configuration
  lang = 'en';

  localizationArray = [];

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    // TODO: discussion whether this information is coming from a service or is configured at development time
    this.localizationArray = [
      { key: 'en', value: 'English' },
      { key: 'de', value: 'German' }
    ];
  }

  languageChange(lang) {
    this.lang = lang;
    this.translate.use(lang);
  }
}
