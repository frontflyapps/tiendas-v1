import { DialogNoCartSelectedComponent } from './no-cart-selected/no-cart-selected.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogEnzonaConfirmToPayComponent } from './dialog-enzona-confirm-to-pay/dialog-enzona-confirm-to-pay.component';
import { EnzonaPaymentOkComponent } from './enzona-payment-ok/enzona-payment-ok.component';
import { DialogBidaiondoConfirmToPayComponent } from './dialog-bidaiondo-confirm-to-pay/dialog-bidaiondo-confirm-to-pay.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CheckoutComponent } from './checkout/checkout.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProcessingPaymentErrorComponent } from './processing-payment-error/processing-payment-error.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmationDialogFrontModule } from 'src/app/components/shared/confirmation-dialog-front/confirmation-dialog-front.module';
import { TaxesShippingService } from '../../core/services/taxes-shipping/taxes-shipping.service';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DetailsShippingComponent } from './details-shipping/details-shipping.component';
import { MatTableModule } from '@angular/material/table';
import { DialogTranfermovilQrComponent } from './dialog-tranfermovil-qr/dialog-tranfermovil-qr.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        CheckoutRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        TranslateModule,
        MatIconModule,
        MatCheckboxModule,
        MatButtonModule,
        MatTableModule,
        PipesModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatDividerModule,
        NgxSkeletonLoaderModule,
        MatMenuModule,
        MatDialogModule,
        MatStepperModule,
        NgxMaterialTimepickerModule,
        MatDatepickerModule,
        ConfirmationDialogFrontModule,
        MatExpansionModule,
    ],
    declarations: [
        CheckoutComponent,
        EnzonaPaymentOkComponent,
        ProcessingPaymentErrorComponent,
        DialogEnzonaConfirmToPayComponent,
        DialogNoCartSelectedComponent,
        DetailsShippingComponent,
        DialogTranfermovilQrComponent,
        DialogBidaiondoConfirmToPayComponent,
    ],
    providers: [TaxesShippingService]
})
export class CheckoutModule {
}
