import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { BlogArticlePageComponent } from './blog-article-page.component';

const routes: Routes = [
  {
    path: '',
    component: BlogArticlePageComponent,
    children: [
      {
        path: '**',
        component: BlogArticlePageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [BlogArticlePageComponent],
})
export class BlogArticlePageModule {}
