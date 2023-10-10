import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryMenuNavService {
  private _menuCategories: BehaviorSubject<any[]> = new BehaviorSubject([]);
  private _filterText: BehaviorSubject<any[]> = new BehaviorSubject([]);
  menuCategories$ = this._menuCategories.asObservable();
  filterText$ = this._filterText.asObservable();

  setCategories(data) {
    this._menuCategories.next(data);
  }

  setFilterText(data) {
    this._filterText.next(data);
  }

  updateCategories(categories: any, categoryId?: number) {
   for (const element of categories) {
      element.active = element.id === categoryId;
   }
    return categories;
  }
}
