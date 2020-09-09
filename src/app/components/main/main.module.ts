import { ConfirmPaymentOkComponent } from './confirm-payment-ok/confirm-payment-ok.component';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationItemComponent } from './notification/notification-item/notification-item.component';
import { PanelNotificationsComponent } from './notification/panel-notifications/panel-notifications.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ShopModule } from '../shop/shop.module';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MainComponent, PanelNotificationsComponent, NotificationItemComponent, ConfirmPaymentOkComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    ShopModule,
    SharedModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatBadgeModule,
  ],
})
export class MainModule {}
