import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { NgpImageLazyLoadModule } from 'ngp-lazy-image';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogRoutingModule } from './blog-routing.module';

import { BlogColumnComponent } from './blog-column/blog-column.component';
import { SharedModule } from './../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    BlogRoutingModule,
    TranslateModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NgpImageLazyLoadModule,
    MatCardModule,
    FlexLayoutModule,
  ],
  declarations: [BlogColumnComponent, BlogDetailsComponent],
})
export class BlogModule {}
