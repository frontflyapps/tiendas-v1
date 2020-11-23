import { DialogEditOnDeliveryOrderComponent } from './dialog-edit-on-delivery-order/dialog-edit-on-delivery-order.component';
import { AdminCancelOrderComponent } from './admin-cancel-order/admin-cancel-order.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminTransactionRoutingModule } from './admin-transaction-routing.module';
import { AdminTransactionLayoutComponent } from './admin-transaction-layout/admin-transaction-layout.component';

// ----------------------------------------------
// Material imports //////
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatTabsModule } from '@angular/material/tabs';
import { OrdersConfirmedTableComponent } from './orders-confirmed-table/orders-confirmed-table.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { DialogCancellOrderComponent } from './dialog-cancell-order/dialog-cancell-order.component';
import { DialogAsignOrderToMessengerComponent } from './dialog-asign-order-to-messenger/dialog-asign-order-to-messenger.component';
import { MatListModule } from '@angular/material/list';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrdersCancelledTableComponent } from './orders-cancelled-table/orders-cancelled-table.component';
import { OrdersOnDeliveryTableComponent } from './orders-on-delivery-table/orders-on-delivery-table.component';
import { OrdersRecievedTableComponent } from './orders-recieved-table/orders-recieved-table.component';

@NgModule({
  imports: [
    CommonModule,
    AdminTransactionRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatBadgeModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
    TranslateModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatListModule,
    NgxDaterangepickerMd.forRoot(),
    MatTabsModule,
  ],
  declarations: [
    AdminTransactionLayoutComponent,
    OrdersConfirmedTableComponent,
    TransactionListComponent,
    DialogCancellOrderComponent,
    DialogAsignOrderToMessengerComponent,
    OrderDetailsComponent,
    OrdersCancelledTableComponent,
    OrdersOnDeliveryTableComponent,
    OrdersRecievedTableComponent,
    AdminCancelOrderComponent,
    DialogEditOnDeliveryOrderComponent,
  ],
  providers: [],
})
export class AdminTransactionModule {}
