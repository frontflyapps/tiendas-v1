import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogColumnComponent } from './blog-column/blog-column.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';

const routes: Routes = [
  {
    path: '',
    component: BlogColumnComponent,
  },
  {
    path: ':id',
    component: BlogDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule {
}
