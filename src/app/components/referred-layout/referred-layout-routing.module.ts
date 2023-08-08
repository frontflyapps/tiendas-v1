import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferredLayoutComponent } from './referred-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ReferredLayoutComponent,
  },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferredLayoutRoutingModule { }
