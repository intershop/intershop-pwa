import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { CookiesModalComponent } from './cookies-modal/cookies-modal.component';
import { cookiesPageGuard } from './cookies-page.guard';

const cookiesPageRoutes: Routes = [
  {
    path: '',
    children: [],
    canActivate: [cookiesPageGuard],
    data: {
      meta: {
        title: 'cookie.preferences.heading',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(cookiesPageRoutes), TranslatePipe],
  declarations: [CookiesModalComponent],
})
export class CookiesPageModule {}
