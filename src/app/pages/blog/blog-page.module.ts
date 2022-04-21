import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { BlogPageComponent } from './blog-page.component';

const blogPageRoutes: Routes = [
  { path: '', component: BlogPageComponent },
  {
    path: ':pageletId',
    loadChildren: () => import('../blog-article/blog-article-page.module').then(m => m.BlogArticlePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(blogPageRoutes), SharedModule],
  declarations: [BlogPageComponent],
})
export class BlogPageModule {}
