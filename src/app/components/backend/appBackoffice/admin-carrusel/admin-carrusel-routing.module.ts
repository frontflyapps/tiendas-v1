import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCarruselTableComponent } from './admin-carrusel-table/admin-carrusel-table.component';

const routes: Routes = [
  {
    path: '',
    component: AdminCarruselTableComponent,
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
export class AdminCarruselRoutingModule { }
