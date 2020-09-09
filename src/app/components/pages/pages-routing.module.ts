import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CompareComponent } from './compare/compare.component';




const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'contact', component: ContactComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'compare', component: CompareComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
