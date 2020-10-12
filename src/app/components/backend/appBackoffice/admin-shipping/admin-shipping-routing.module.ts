import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShippingTableComponent } from './shipping-table/shipping-table.component';


const routes: Routes = [
  {
    path: '',
    component: ShippingTableComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminShippingRoutingModule { }
