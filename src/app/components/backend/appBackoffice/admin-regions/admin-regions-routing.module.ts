import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegionsTableComponent } from './regions-table/regions-table.component';


const routes: Routes = [
  {
    path: '',
    component: RegionsTableComponent,
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
export class AdminRgionsRoutingModule { }
