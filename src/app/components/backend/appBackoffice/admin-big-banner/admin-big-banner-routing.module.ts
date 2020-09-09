import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BigBannerComponent } from './big-banner/big-banner.component';


const routes: Routes = [
  {
    path: '',
    component: BigBannerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminBigBannerRoutingModule { }
