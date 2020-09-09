import { ShowToastrService } from './../../../../core/services/show-toastr/show-toastr.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BiconService } from './../../../backend/services/bicon/bicon.service';
import { CartService } from './../../../shared/services/cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from './../../../../modals/product.model';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from './../../../../core/services/utils/utils.service';
import { IPagination } from './../../../../core/classes/pagination.class';
import { environment } from './../../../../../environments/environment';
import { Subject } from 'rxjs';
import { LoggedInUserService } from './../../../../core/services/loggedInUser/logged-in-user.service';
import { CurrencyService } from './../../../../core/services/currency/currency.service';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Cart } from 'src/app/modals/cart-item';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  isLoading = false;
  product: any = {};
  products: any[] = [];
  relatedProduct: any[] = [];
  featuredProducts: any[] = [];
  imageUrl = environment.imageUrl;
  arrayImages: any[] = [];
  mainImage = null;
  changeImage = false;
  language: any;
  _unsubscribeAll: Subject<any>;
  loggedInUser: any = null;
  reviewForm: FormGroup;
  loadingReviews = false;
  allReviews = [];
  showZoom = false;

  public image: any;
  public zoomImage: any;
  public counter: number = 1;
  index: number;
  apiUrlRepositoy = environment.apiUrlRepositoy;
  localDatabaseUsers = environment.localDatabaseUsers;
  uploadDigitalProduct = environment.uploadDigitalProduct;
  type = undefined;

  loadingFeatured = false;
  loadingRelated = false;
  queryFeatured: IPagination = {
    limit: 8,
    offset: 0,
    total: 0,
    order: '-createdAt',
  };

  queryRelated: IPagination = {
    limit: 8,
    offset: 0,
    total: 0,
    order: '-createdAt',
  };

  typesProducts = {
    physical: {
      name: { es: 'Físico', en: 'Physical' },
    },
    digital: {
      name: { es: 'Digital', en: 'Digital' },
    },
    service: {
      name: { es: 'Servicio', en: 'Service' },
    },
  };

  allBicons: any[] = [];

  queryReviews: IPagination = {
    limit: 5,
    total: 0,
    offset: 0,
    order: '-updatedAt',
    page: 1,
    filter: { filterText: '' },
  };

  indexTab = 0;
  errorPage = false;

  previewUrl: any;
  referenceUrl: any;
  thumbnailUrl: any;
  videoUrl: any;
  youtubeUrl: any;

  constructor(
    private route: ActivatedRoute,
    public productsService: ProductService,
    public currencyService: CurrencyService,
    public loggedInUserService: LoggedInUserService,
    public dialog: MatDialog,
    private router: Router,
    private biconService: BiconService,
    public utilsService: UtilsService,
    private cartService: CartService,
    private showToastr: ShowToastrService,
    public _sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private httpCient: HttpClient,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();

    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.productsService.productIdDetails = id;
      // console.log(
      //   'ProductDetailsComponent ->   this.productsService.productIdDetails',
      //   this.productsService.productIdDetails,
      // );
      this.isLoading = true;
      this.productsService.getProductById(id).subscribe(
        (data) => {
          this.product = data.data;
          this.type = this.product.type;
          this.initStateView();
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.utilsService.errorHandle(error);
          this.errorPage = true;
        },
      );
    });
  }

  initStateView() {
    this.indexTab = 0;
    this.allReviews = [];
    this.queryReviews.limit = 5;
    this.queryReviews.offset = 0;
    this.queryReviews.page = 1;
    this.counter = this.product.minSale;
    this.getReviews();
    if (this.product.Image) {
      this.arrayImages = this.product.Image.map((item) => {
        return { image: this.imageUrl + item.image, selected: false };
      });
      this.arrayImages[0].selected = true;
      this.mainImage = this.arrayImages[0];
    }
    this.getRelatedProducts();
    this.getFeaturedProducts();
    this.procesDataDemoAndReference();
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.loggedInUserService.$loggedInUserUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.loggedInUser = this.loggedInUserService.getLoggedInUser();
    });

    this.biconService.getAllBicons({ offset: 0, limit: 4, order: 'updatedAt' }).subscribe(
      (data) => {
        this.allBicons = data.data;
      },
      (error) => {
        this.allBicons = [];
      },
    );

    this.reviewForm = this.fb.group({
      review: [null, [Validators.required, Validators.maxLength(250), Validators.minLength(10)]],
      rating: [3.5, Validators.required],
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  onSelectImage(index) {
    this.arrayImages.map((item) => {
      item.selected = false;
    });
    this.arrayImages[index].selected = true;
    this.mainImage = this.arrayImages[index];
  }

  public increment() {
    this.counter += 1;
  }

  public decrement() {
    if (this.counter > 1) {
      this.counter -= 1;
    }
  }

  getRelatedProducts() {
    this.loadingRelated = true;
    this.productsService.getRecomendedProduct(this.product.id).subscribe((data: any) => {
      this.relatedProduct = data.data;
      const timeOut = setTimeout(() => {
        this.loadingRelated = false;
        clearTimeout(timeOut);
      }, 800);
    });
  }

  getFeaturedProducts() {
    this.loadingFeatured = true;
    this.productsService.getFeaturedProducts(this.queryFeatured).subscribe((data: any) => {
      this.featuredProducts = data.data;
      const timeOut = setTimeout(() => {
        this.loadingFeatured = false;
        clearTimeout(timeOut);
      }, 800);
    });
  }

  // Add to cart
  public addToCart(product: any, quantity) {
    if (quantity === 0) {
      return false;
    }
    this.cartService.addToCart(product, Math.max(product.minSale, quantity));
  }

  // Add to cart
  public buyNow(product: Product, quantity) {
    if (quantity > 0) {
      try {
        this.cartService.addToCart(product, parseInt(quantity, 10)).then((carts: Cart[]) => {
          for (let cart of carts) {
            let dataFind = cart.CartItems.find((cartItemx) => cartItemx?.ProductId == product.id);
            if (dataFind != undefined) {
              let cartId = cart?.id;
              this.router.navigate(['/checkout'], { queryParams: { cartId } });
              return;
            }
          }
        });
      } catch (error) {
        console.log('error');
      }
    }
  }

  public openZoomViewer() {
    // this.dialog.open(ProductZoomComponent, {
    //   data: this.mainImage,
    //   panelClass: 'zoom-dialog',
    // });
    this.showZoom = !this.showZoom;
  }

  //////////////////////////////////////////////////////////
  onPostReview() {
    let data: any = this.reviewForm.value;
    data.ProductId = this.product.id;
    if (data.id) {
      this.productsService.editReview(data).subscribe((data) => {
        this.showToastr.showSucces('Comentario editado exitósamente', 'Éxito', 3000);
        let index = this.allReviews.findIndex((item) => item.id == data.data.id);
        this.allReviews[index] = data.data;
        this.reviewForm.reset();
      });
    } else {
      this.productsService.createReview(data).subscribe((data) => {
        this.showToastr.showSucces('Comentario creado exitósamente', 'Éxito', 3000);
        this.allReviews.unshift(data.data);
        this.reviewForm.reset();
      });
    }
  }

  getReviews() {
    this.loadingReviews = true;
    this.productsService.getReviews(this.queryReviews, { ProductId: this.product.id }).subscribe(
      (data) => {
        this.allReviews = this.allReviews.concat(data.data.flat());
        this.queryReviews.offset += data.meta.pagination.count;
        this.queryReviews.total = data.meta.pagination.total;
        this.loadingReviews = false;
      },
      (error) => {
        this.loadingReviews = false;
      },
    );
  }

  onGetMorePriviews() {
    this.getReviews();
  }

  onEditReview(review) {
    this.reviewForm = this.fb.group({
      review: [review.review, [Validators.required, Validators.maxLength(250), Validators.minLength(10)]],
      rating: [review.rating, Validators.required],
      id: [review.id],
    });
  }

  onAddtoCartNav() {
    this.cartService.addToCart(this.product, this.counter);
    this.router.navigate(['/cart']);
  }

  onAddtoCompListNav() {
    this.productsService.addToCompare(this.product);
    this.router.navigate(['/pages/compare']);
  }

  onGoToCheckouNav() {
    this.buyNow(this.product, 1);
  }

  procesDataDemoAndReference() {
    if (this.product && this.product.type == 'digital' && this.uploadDigitalProduct && !this.localDatabaseUsers) {
      this.previewUrl =
        this.product.Digital && this.product.Digital.previewUrl ? this.product.Digital.previewUrl : undefined;
      this.referenceUrl =
        this.product.Digital && this.product.Digital.referenceUrl ? this.product.Digital.referenceUrl : undefined;

      if (this.product.Digital.formatTypePreviewUrl == 'video' && this.previewUrl) {
        this.videoUrl = this.previewUrl;
      }
      if (this.previewUrl) {
        this.getMetaDataFromUrl(this.previewUrl).then((data: any) => {
          this.thumbnailUrl = data.data.thumbnail || undefined;
        });
      }
    }
  }

  getMetaDataFromUrl(url) {
    return this.httpCient.get(this.apiUrlRepositoy + 'file-meta?url=' + url).toPromise();
  }
}
