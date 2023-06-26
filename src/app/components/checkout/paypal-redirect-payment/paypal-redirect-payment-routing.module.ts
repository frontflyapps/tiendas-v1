import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaypalRedirectPaymentComponent } from './paypal-redirect-payment.component';

const routes: Routes = [
  {
    path: '',
    component: PaypalRedirectPaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaypalRedirectPaymentRoutingModule { }
