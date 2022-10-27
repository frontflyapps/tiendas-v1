import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';

import { ProcessingPaymentErrorComponent } from './processing-payment-error/processing-payment-error.component';
import { EnzonaPaymentOkComponent } from './enzona-payment-ok/enzona-payment-ok.component';
import { ReceiverFormComponent } from './reciever-form/receiver-form.component';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
  },
  {
    path: 'product-on-request',
    component: ReceiverFormComponent,
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
export class CheckoutRoutingModule {}
