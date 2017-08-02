import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'is-languageswitch',
  templateUrl: './languageSwitch.component.html'
})

export class LanguageSwitchComponent implements OnInit {
  public isCollapsed: boolean = true;
  lang: string = 'en';

  localizationArray = [];

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.localizationArray = [
      { key: 'en', value: 'English' },
      { key: 'de', value: 'German' }
    ];
    console.log(this.localizationArray);
  }
  languageChange(lang) {
    this.lang = lang;
    this.isCollapsed = !this.isCollapsed;
    this.translate.use(lang);
  }
};

