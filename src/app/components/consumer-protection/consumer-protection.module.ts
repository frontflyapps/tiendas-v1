import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerProtectionComponent } from './consumer-protection.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

const routes: Routes = [{ path: '', component: ConsumerProtectionComponent }];

@NgModule({
  declarations: [ConsumerProtectionComponent],
  imports: [CommonModule, FlexLayoutModule, MatIconModule, TranslateModule, RouterModule.forChild(routes), PipesModule],
})
export class ConsumerProtectionModule {}
