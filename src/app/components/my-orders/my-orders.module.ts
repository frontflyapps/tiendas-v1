import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { CancelOrderComponent } from './cancel-order/cancel-order.component';
import { NgpLazyLoadModule } from 'ngp-lazy-load';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

// ----------------------------------------------

////////// --------MATERIAL MODULES------- /////////////////////////
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MyOrdersRoutingModule } from './my-orders-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { NgpMaterialRatingModule } from 'ngp-material-rating';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { DialogBidaiondoCancelToPayComponent } from './dialog-bidaiondo-cancel-to-pay/dialog-bidaiondo-cancel-to-pay.component';
import { EditOrderComponent } from './edit-order/edit-order.component';

///////////////////////////////////////////////////////////////////

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyOrdersRoutingModule,
    FlexLayoutModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatDividerModule,
    MatInputModule,
    MatSidenavModule,
    MatRippleModule,
    MatTabsModule,
    MatSelectModule,
    TranslateModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    NgpMaterialRatingModule,
    NgpLazyLoadModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  declarations: [MyOrdersComponent, CancelOrderComponent, DialogBidaiondoCancelToPayComponent, EditOrderComponent],
  entryComponents: [CancelOrderComponent, DialogBidaiondoCancelToPayComponent, EditOrderComponent],
  providers: [],
})
export class MyOrdersModule {
}
