import { AdminProductLayoutComponent } from './admin-product-layout/admin-product-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminListBrandsComponent } from './admin-list-brands/admin-list-brands.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { EditProductResolverService } from './edit-product/edit-product-resolver.service';
import { TreeCategoryComponent } from './admin-list-categories/tree-category/tree-category.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
  },

  {
    path: 'list',
    component: AdminProductLayoutComponent,
  },
  {
    path: 'categories',
    component: TreeCategoryComponent,
  },
  {
    path: 'brands',
    component: AdminListBrandsComponent,
  },
  {
    path: 'create-product',
    component: CreateProductComponent,
  },
  {
    path: 'edit-product/:id',
    component: EditProductComponent,
    resolve: {
      product: EditProductResolverService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProductRoutingModule {}
