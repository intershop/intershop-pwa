import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactUsModule } from '../../contact-us.module';

import { ContactConfirmationComponent } from './contact-confirmation/contact-confirmation.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactPageComponent } from './contact-page.component';

const contactPageRoutes: Routes = [
  {
    path: '',
    component: ContactPageComponent,
    data: {
      meta: {
        title: 'helpdesk.contact_us.heading',
        robots: 'index, nofollow',
      },
      breadcrumbData: [{ key: 'helpdesk.contact_us.link' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(contactPageRoutes), ContactUsModule],
  declarations: [ContactConfirmationComponent, ContactFormComponent, ContactPageComponent],
})
export class ContactPageModule {}
