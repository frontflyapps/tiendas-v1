import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { CancelOrderComponent } from './cancel-order/cancel-order.component';
import { NgpImageLazyLoadModule } from 'ngp-lazy-image';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { MyOrdersRoutingModule } from './my-orders-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { NgpMaterialRatingModule } from 'ngp-material-rating';

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
    MatSidenavModule,
    MatRippleModule,
    MatTabsModule,
    TranslateModule,
    MatCardModule,
    NgpMaterialRatingModule,
    NgpImageLazyLoadModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  declarations: [MyOrdersComponent, CancelOrderComponent],
  entryComponents: [CancelOrderComponent],
  providers: [],
})
export class MyOrdersModule {}
