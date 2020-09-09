import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { ProductLeftSidebarComponent } from './products/product-left-sidebar/product-left-sidebar.component';
import { MainHomeComponent } from './main-home/main-home.component';
// import { HomeTwoComponent } from './home-two/home-two.component';
// import { HomeThreeComponent } from './home-three/home-three.component';
// import { HomeFiveComponent } from './home-five/home-five.component';

// Routes
const routes: Routes = [
  {
    path:'',
    redirectTo:'home',
    pathMatch:'full'
},
  {
    path: 'home', component: MainHomeComponent,
 },
  { path: 'two', component: MainHomeComponent },
  // { path: 'three', component: HomeThreeComponent },
  // { path: 'four', component: HomeFourComponent },
  // { path: 'five', component: HomeFiveComponent },
  { path: 'products/search', component: ProductLeftSidebarComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
