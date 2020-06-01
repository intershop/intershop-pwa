import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ContactConfirmationComponent } from './contact-confirmation/contact-confirmation.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactPageComponent } from './contact-page.component';

const contactPageRoutes: Routes = [{ path: '', component: ContactPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(contactPageRoutes), SharedModule],
  declarations: [ContactConfirmationComponent, ContactFormComponent, ContactPageComponent],
})
export class ContactPageModule {}
