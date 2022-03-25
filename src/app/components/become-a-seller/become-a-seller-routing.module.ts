import { BecomeASellerComponent } from './become-a-seller/become-a-seller.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: BecomeASellerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BecomeASellerRoutingModule {
}
