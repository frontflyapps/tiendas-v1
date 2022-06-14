import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryMenuNavService {
  private _menuCategories: BehaviorSubject<any[]> = new BehaviorSubject([]);
  menuCategories$ = this._menuCategories.asObservable();

  setCategories(data) {
    this._menuCategories.next(data);
  }

  updateCategories(categories: any, categoryId?: number) {
   for (const element of categories) {
      element.active = element.id === categoryId;
   }
    return categories;
  }
}
