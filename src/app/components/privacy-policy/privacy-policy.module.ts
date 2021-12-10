import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: PrivacyPolicyComponent,
  },
];


@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    RouterModule.forChild(routes),
    PipesModule,
  ],
})
export class PrivacyPolicyModule {
}
