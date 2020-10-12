import { PreviousRouteService } from './../../core/services/previous-route/previous-route.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendRoutingModule } from './backend-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonDialogsModule } from './common-dialogs-module/common-dialogs.module';
////////// --------MATERIAL MODULES------- /////////////////////////
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
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavService } from './common-layout-components/menu-list-item/nav.service';
import { BreadcrumbService } from './common-layout-components/breadcrumd/service/breadcrumb.service';
import { BreadcrumdComponent } from './common-layout-components/breadcrumd/breadcrumd.component';
import { MenuListItemComponent } from './common-layout-components/menu-list-item/menu-list-item.component';
import { PanelNotificationsComponent } from './common-layout-components/panel-notifications/panel-notifications.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminTransactionService } from './appBackoffice/admin-transaction/services/admin-orders/admin-transaction.service';
import { PdfGenService } from 'src/app/core/services/get-pdf/pdf-gen.service';

///////////////////////////////////////////////////////////////////
@NgModule({
  imports: [
    CommonModule,
    BackendRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    TranslateModule,
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
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatSidenavModule,
    MatProgressBarModule,
    CommonDialogsModule,
  ],
  declarations: [LayoutComponent, PanelNotificationsComponent, MenuListItemComponent, BreadcrumdComponent],
  entryComponents: [],
  providers: [BreadcrumbService, NavService, PreviousRouteService, PdfGenService, AdminTransactionService],
  exports: [],
})
export class BackendModule {}
