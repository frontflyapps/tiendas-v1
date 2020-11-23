import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainCarouselComponent } from './main-carousel/main-carousel.component';
import { PriceComponent } from './products/price/price.component';
import { ProductComponent } from './products/product/product.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { ProductDialogComponent } from './products/product-dialog/product-dialog.component';
import { ProductLeftSidebarComponent } from './products/product-left-sidebar/product-left-sidebar.component';
import { ProductVerticalComponent } from './products/product-vertical/product-vertical.component';
import { CommonModule } from '@angular/common';
import { ShopRoutingModule } from './shop-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxPaginationModule } from 'ngx-pagination';
// Import the library
import { ProductCarouselTwoComponent } from './product-carousel-two/product-carousel-two.component';
import { ProductCarouselComponent } from './product-carousel/product-carousel.component';
import { BrandsComponent } from './widgets/brands/brands.component';
import { CategoriesComponent } from './widgets/categories/categories.component';
import { PopularProductsComponent } from './widgets/popular-products/popular-products.component';
import { MainHomeComponent } from './main-home/main-home.component';
import { ProductZoomComponent } from './products/product-details/product-zoom/product-zoom.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SkeletonLoadingCardsModule } from '../shared/skeleton-loading-cards/skeleton-loading-cards.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgpMaterialRatingModule } from '../shared/ngp-material-rating/ngp-material-rating.module';
import { NgpImageLazyLoadModule } from 'ngp-lazy-image';
import { BannerPromotionComponent } from './banner-promotion/banner-promotion.component';
import { BannerPromotion2Component } from './banner-promotion2/banner-promotion2.component';
import { DialogFiltersMComponent } from './products/dialog-filters-m/dialog-filters-m.component';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    MainCarouselComponent,
    PriceComponent,
    ProductComponent,
    ProductDetailsComponent,
    ProductDialogComponent,
    ProductLeftSidebarComponent,
    ProductVerticalComponent,
    ProductCarouselComponent,
    ProductCarouselTwoComponent,
    BrandsComponent,
    CategoriesComponent,
    PopularProductsComponent,
    MainHomeComponent,
    ProductZoomComponent,
    BannerPromotionComponent,
    BannerPromotion2Component,
    DialogFiltersMComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    SharedModule,
    SwiperModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxPaginationModule,
    MatProgressSpinnerModule,
    TranslateModule,
    NgpImageLazyLoadModule,
    SkeletonLoadingCardsModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    NgpMaterialRatingModule,
  ],
  exports: [ProductDialogComponent],

  entryComponents: [],
})
export class ShopModule {}
