import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { UtilsService } from './../../../../core/services/utils/utils.service';
import { LoggedInUserService } from './../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { CategoriesService } from 'src/app/core/services/categories/catagories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  imageUrl = environment.imageUrl;
  language: any;
  _unsubscribeAll: Subject<any>;
  categories: any[] = [];
  allCategories: any[] = [];
  selection: SelectionModel<any>;
  isRootLevel = true;
  lastCategoryId = undefined;

  @Output() categoryChanged: EventEmitter<any> = new EventEmitter();

  @Input() set categoriesIds(value) {
    if (value) {
      this.selection.clear();
      value.map((id) => {
        this.selection.select(+id);
      });
    }
  }
  constructor(
    private utilsService: UtilsService,
    private brandService: CategoriesService,
    public loggedInUserService: LoggedInUserService,
  ) {
    this.selection = new SelectionModel(true, []);
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.brandService.getAllCategories().subscribe((data) => {
      this.allCategories = data.data;
      this.getRootCategories();
    });
  }

  getRootCategories() {
    this.categories = this.allCategories.filter((item) => item.ParentCategoryId == undefined);
  }

  getChildCategories(category) {
    if (category && category.id) {
      this.categories = this.allCategories.filter((item) => item.ParentCategoryId == category.id);
      this.isRootLevel = false;
      this.lastCategoryId = { id: category.ParentCategoryId };
    } else {
      this.getRootCategories();
      this.isRootLevel = true;
      this.lastCategoryId = undefined;
    }

    let element = document.getElementById('topLeftSidebar');
    if (!this.categories.length) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  showNameCategory(category) {
    let value: string = category.name[this.language] ? category.name[this.language] : category.name['es'];
    return value.length > 25 ? value.substr(0, 23) + '...' : value;
  }

  onChangeSelection(categoryId) {
    this.selection.toggle(categoryId);
    if (this.selection.isSelected(categoryId)) {
      this.allCategories
        .filter((item) => item.ParentCategoryId == categoryId)
        .map((item) => {
          this.selection.select(item.id);
        });
    } else {
      this.allCategories
        .filter((item) => item.ParentCategoryId == categoryId)
        .map((item) => {
          this.selection.deselect(item.id);
        });
    }
    const arrayCategoryIds = [...this.selection.selected];
    this.categoryChanged.emit(arrayCategoryIds);
  }
}
