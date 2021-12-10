import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorRoutingModule } from './error-routing.module';
import { ForbiddenAccessComponent } from './forbidden-access/forbidden-access.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OutdatedVersionComponent } from './outdated-version/outdated-version.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LostConexionComponent } from './lost-conexion/lost-conexion.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [
    ForbiddenAccessComponent,
    OutdatedVersionComponent,
    LostConexionComponent,
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
})
export class ErrorModule {
}
