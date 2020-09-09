import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TermsConditionsComponent } from './terms-conditions.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  { path: '', component: TermsConditionsComponent }
];


@NgModule({
  declarations: [
    TermsConditionsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ]
})
export class TermsConditionsModule { }
