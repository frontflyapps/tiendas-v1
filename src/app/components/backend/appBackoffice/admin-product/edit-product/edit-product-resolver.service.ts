import { Injectable } from '@angular/core';
import { ProductService } from '../../../../shared/services/product.service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditProductResolverService {
  constructor(private productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    console.log('Entre Aqui');
    return this.productService.getProductAdminById(route.params['id']);
  }
}
