import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { LoggedInUserService } from '../../../../core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { CategoriesService } from 'src/app/core/services/categories/catagories.service';
import { CATEGORIES_DATA } from '../../../../core/classes/global.const';
import { LocalStorageService } from '../../../../core/services/localStorage/localStorage.service';

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

  constructor(
    private utilsService: UtilsService,
    private brandService: CategoriesService,
    public loggedInUserService: LoggedInUserService,
    private localStorageService: LocalStorageService,
  ) {
    this.selection = new SelectionModel(true, []);
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  @Input() set categoriesIds(value) {
    if (Array.isArray(value) && value.length === 0) {
      this.selection.clear();
    }

    if (Array.isArray(value[0])) {
      this.selection.clear();
      value.map((id) => {
        this.selection.select(+id);
      });
    }
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.getCatFromStorage();
  }

  getCatFromStorage() {
    try {
      const categories = this.localStorageService.getFromStorage(CATEGORIES_DATA);

      if (!categories?.timespan || !Array.isArray(categories.cat) || categories?.cat.length <= 0) {
        this.getCategories();
        return;
      }

      if (this.localStorageService.iMostReSearch(categories?.timespan, environment.timeToResearchProductData)) {
        this.getCategories();
      } else {
        this.setDataOnGetCategories(categories.cat);
      }
    } catch (e) {
      this.getCategories();
    }
  }

  getCategories() {
    this.brandService.getAllCategories().subscribe((data) => {
        this.setDataOnGetCategories(data.data);

        const _response: any = {};
        _response.cat = JSON.parse(JSON.stringify(data.data));
        _response.timespan = new Date().getTime();
        this.localStorageService.setOnStorage(CATEGORIES_DATA, _response);
      },
      error =>
        this.brandService.allCategories = [],
    );
  }

  setDataOnGetCategories(categories) {
    this.allCategories = categories;
    this.brandService.allCategories = categories;
    this.getRootCategories();
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

    // if (this.selection.isSelected(categoryId)) {
    //   this.allCategories
    //     .filter((item) => item.ParentCategoryId == categoryId)
    //     .map((item) => {
    //       this.selection.select(item.id);
    //       console.log('-> this.selection IIIFFFF', this.selection);
    //     });
    // } else {
    //   this.allCategories
    //     .filter((item) => item.ParentCategoryId == categoryId)
    //     .map((item) => {
    //       this.selection.deselect(item.id);
    //       console.log('-> this.selection ELSEEE', this.selection);
    //     });
    // }

    const arrayCategoryIds = [...this.selection.selected];
    this.categoryChanged.emit(arrayCategoryIds);
  }
}
