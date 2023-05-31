import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogCaptchaComponent } from './dialog-captcha.component';

// Routes
const routes: Routes = [
  {
    path: '',
    component: DialogCaptchaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialogCaptchaRoutingModule {
}
