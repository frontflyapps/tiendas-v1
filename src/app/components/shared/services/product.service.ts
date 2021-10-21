import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscriber } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../../../modals/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IPagination } from '../../../core/classes/pagination.class';
import { environment } from '../../../../environments/environment';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem('compareItem')) || [];

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  ////////// Urls /////////
  urlFrontProductsData = environment.apiUrl + 'front-data-product';
  urlProduct = environment.apiUrl + 'product';
  urlProductId = environment.apiUrl + 'product/:id';
  urlProductidImage = environment.apiUrl + 'product/:id/image';
  urlProductidImageId = environment.apiUrl + 'product/:id/image/:imageId';
  urlRecomendedProduct = environment.apiUrl + 'product/:id/recomended';
  urlRecomendedProductId = environment.apiUrl + 'product/:id/recomended/:recomendedId';
  urlPromotion = environment.apiUrl + 'product-promotion/:id';
  urlPreview = environment.apiUrl + 'review';
  // -----ADMIN RUTES-------------
  urlProductAdmin = environment.apiUrl + 'admin/product';
  urlProductIdAdmin = environment.apiUrl + 'admin/product/:id';
  // ----------------------------

  //////////////////////////
  public currency: string = 'USD';
  public catalogMode: boolean = false;

  private _url: string = 'assets/data/';
  public url = 'assets/data/banners.json';

  public compareProducts: BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public observer: Subscriber<{}>;
  public productIdDetails = undefined;

  constructor(private httpClient: HttpClient, public snackBar: MatSnackBar) {
    this.compareProducts.subscribe((products) => (products = products));
  }

  ////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  ////////Rutas que consumen de Un API////////////////
  public getAllProducts(query?: IPagination, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());

      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(item, '%' + query.filter.filterText + '%');
        });
      }

      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }
    if (params) {
      if (params.filterText) {
        httpParams = httpParams.append('filter[$or][name][$like]', '%' + params.filterText + '%');
        httpParams = httpParams.append('filter[$or][tags][$like]', '%' + params.filterText + '%');
        httpParams = httpParams.append('filter[$or][description][$like]', '%' + params.filterText + '%');
      }
      if (params.brandIds && params.brandIds.length) {
        if (params.brandIds.length > 1) {
          params.brandIds.map((item) => {
            httpParams = httpParams.append('filter[$and][BrandId][$in]', item);
          });
        } else {
          httpParams = httpParams.append('filter[$and][BrandId][$in]', params.brandIds[0]);
          httpParams = httpParams.append('filter[$and][BrandId][$in]', params.brandIds[0]);
        }
      }
      if (params.categoryIds && params.categoryIds.length) {
        if (params.categoryIds.length > 1) {
          params.categoryIds.map((item) => {
            httpParams = httpParams.append('CategoryIds', item);
          });
        } else {
          httpParams = httpParams.append('CategoryIds', params.categoryIds[0]);
          httpParams = httpParams.append('CategoryIds', params.categoryIds[0]);
        }
      }
      if (params.minPrice && params.maxPrice) {
        httpParams = httpParams.set('filter[$and][price][$gte]', params.minPrice);
        httpParams = httpParams.set('filter[$and][price][$lte]', params.maxPrice);
      }

      if (params.type) {
        httpParams = httpParams.set('filter[$and][type]', params.type);
      }
    }
    return this.httpClient.get<any>(this.urlProduct, { params: httpParams });
    // return this.products();
  }

  public searchProduct(data?: any): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + 'search', data);
    // return this.products();
  }

  public getCountProduct(): Observable<any> {
    return this.httpClient.get<any>(this.urlProduct + '-count');
  }

  /*public getProductById(id): Observable<any> {
    return this.httpClient.get<any>(this.urlProductId.replace(':id', id));
  }*/

  public getProductById(id, StockId): Observable<any> {
    const data = {
      StockId: StockId,
    };
    return this.httpClient.post<any>(`${this.urlProduct}/${id}/profile`, data);
  }

  // ///////////////RUTAS DE ADMINISTRADOR///////////////////////
  public getAllAdminProducts(query?: IPagination, params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());

      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(item, '%' + query.filter.filterText + '%');
        });
      }

      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }
    if (params) {
      if (params.type) {
        httpParams = httpParams.set('filter[$and][type]', params.type);
      }
      if (params.status) {
        httpParams = httpParams.append('filter[$and][status]', params.status);
      }
    }
    return this.httpClient.get<any>(this.urlProductAdmin, { params: httpParams });
  }

  public getProductAdminById(id): Observable<any> {
    return this.httpClient.get<any>(this.urlProductIdAdmin.replace(':id', id));
  }

  ////////////////////////////////////////////////////

  public createProduct(data): Observable<any> {
    return this.httpClient.post<any>(this.urlProduct, data);
  }

  removeProduct(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlProductId.replace(':id', data.id)).toPromise();
  }

  public editProduct(data): Observable<any> {
    return this.httpClient.patch<any>(this.urlProductId.replace(':id', data.id), data);
  }

  public createImageProduct(data): Observable<any> {
    return this.httpClient.post<any>(this.urlProductidImage.replace(':id', data.fkId), data);
  }

  public getImageProduct(data): Observable<any> {
    return this.httpClient.get<any>(this.urlProductidImage.replace(':id', data.fkId), data);
  }

  public editImageProduct(data): Promise<any> {
    return this.httpClient
      .patch<any>(this.urlProductidImageId.replace(':id', data.fkId).replace(':imageId', data.id), data)
      .toPromise();
  }

  public deleteImageProduct(data): Promise<any> {
    return this.httpClient
      .delete<any>(this.urlProductidImageId.replace(':id', data.fkId).replace(':imageId', data.id))
      .toPromise();
  }

  public createRecomendedProduct(productId, data): Observable<any> {
    return this.httpClient.post<any>(this.urlRecomendedProduct.replace(':id', productId), data);
  }

  public getRecomendedProduct(productId): Observable<any> {
    return this.httpClient.get<any>(this.urlRecomendedProduct.replace(':id', productId));
  }

  public getPopularProduct(query?: IPagination): Observable<any> {
    let httpParams = new HttpParams();
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());
      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }

    httpParams = httpParams.set('filter[$and][rating][$gte]', '3.0');
    return this.httpClient.get<any>(this.urlProduct, { params: httpParams });
  }

  public getFeaturedProducts(query?: IPagination): Observable<any> {
    let httpParams = new HttpParams();
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());

      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }
    httpParams = httpParams.set('filter[$and][isFeatured]', '1');
    return this.httpClient.get<any>(this.urlProduct, { params: httpParams });
  }

  public productPromotion(data): Observable<any> {
    return this.httpClient.post<any>(this.urlPromotion.replace(':id', data.id), {});
  }

  public getFrontProductsData(query?: IPagination): Observable<any> {
    let httpParams = new HttpParams();
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());
      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }

    httpParams = httpParams.set('filter[$and][rating][$gte]', '3.0');
    
    return this.httpClient.get<any>(this.urlFrontProductsData, { params: httpParams });
  }

  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  // ---------------------------------------------
  // ----------  Review Product  ----------------
  // ---------------------------------------------
  // */

  createReview(data): Observable<any> {
    return this.httpClient.post(this.urlPreview, data);
  }

  editReview(data): Observable<any> {
    return this.httpClient.patch(this.urlPreview + '/' + data.id, data);
  }

  getReviews(query?: IPagination, param?: any) {
    let httpParams = new HttpParams();
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());

      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }
    if (param) {
      httpParams = httpParams.set('filter[$and][ProductId]', param.ProductId);
    }
    return this.httpClient.get<any>(this.urlPreview, { params: httpParams });
  }

  // ---------------------------------------------
  // ----------  Compare Product  ----------------
  // ---------------------------------------------
  // */

  // Get Compare Products
  public getComapreProducts(): Observable<Product[]> {
    const itemsStream = new Observable((observer) => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // If item is aleready added In compare
  public hasProduct(product: Product): boolean {
    const item = products.find((item) => item.id === product.id);
    return item !== undefined;
  }

  // Add to compare
  public addToCompare(product: Product): Product | boolean {
    let message, status;
    var item: Product | boolean = false;
    if (this.hasProduct(product)) {
      item = products.filter((item) => item.id === product.id)[0];
      const index = products.indexOf(item);
      this.snackBar.open('El producto ' + product.name['es'] + ' ya está en la lista de comparación.', '×', {
        panelClass: 'error',
        verticalPosition: 'top',
        duration: 3000,
      });
    } else {
      if (products.length < 4) {
        products.push(product);
      }
      message = 'El producto ' + product.name['es'] + ' ha sido agregado a la lista de comparación';
      status = 'success';
      this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    }
    localStorage.setItem('compareItem', JSON.stringify(products));
    return item;
  }

  // Removed Product
  public removeFromCompare(product: Product) {
    if (product === undefined) {
      return;
    }
    const index = products.indexOf(product);
    products.splice(index, 1);
    localStorage.setItem('compareItem', JSON.stringify(products));
  }
}
