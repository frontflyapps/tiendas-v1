import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';

import { ProcessingPaymentErrorComponent } from './processing-payment-error/processing-payment-error.component';
import { EnzonaPaymentOkComponent } from './enzona-payment-ok/enzona-payment-ok.component';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
  },
  {
    path: 'enzona-payment-ok',
    component: EnzonaPaymentOkComponent,
  },
  {
    path: 'enzona-payment-error',
    component: ProcessingPaymentErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {
}
