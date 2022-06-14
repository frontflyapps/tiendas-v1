import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { ProductLeftSidebarComponent } from './products/product-left-sidebar/product-left-sidebar.component';
import { MainHomeComponent } from './main-home/main-home.component';

// Routes
const routes: Routes = [
  {
    path: '',
    component: MainHomeComponent,
  },
  { path: 'two', component: MainHomeComponent },
  { path: 'products/search', component: ProductLeftSidebarComponent },
  { path: 'product', component: ProductDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopRoutingModule {
}
