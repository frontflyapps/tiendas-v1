import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaypalRedirectPaymentRoutingModule } from './paypal-redirect-payment-routing.module';
import { PaypalRedirectPaymentComponent } from './paypal-redirect-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    PaypalRedirectPaymentComponent
  ],
  imports: [
    CommonModule,
    PaypalRedirectPaymentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FlexLayoutModule
  ]
})
export class PaypalRedirectPaymentModule { }
