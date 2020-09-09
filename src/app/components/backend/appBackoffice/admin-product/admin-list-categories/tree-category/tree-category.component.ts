import { TranslateService } from '@ngx-translate/core';
import { CategoriesService } from '../../../../services/categories/catagories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogAddEditCategoriesComponent } from '../dialog-add-edit-categories/dialog-add-edit-categories.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { ShowToastrService } from 'src/app/core/services/show-toastr/show-toastr.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { Subject } from 'rxjs';
import { BreadcrumbService } from '../../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tree-category',
  templateUrl: './tree-category.component.html',
  styleUrls: ['./tree-category.component.scss'],
})
export class TreeCategoryComponent implements OnInit, OnDestroy {
  category: any = undefined;
  categoryId: any = undefined;
  queryParmas: any = undefined;
  allCategories: any[] = [];
  loading = true;
  language = 'es';
  _unsubscribeAll: any;
  lastCategoryId = undefined;
  isRoot = true;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
    private showToastr: ShowToastrService,
    private translate: TranslateService,
    public utils: UtilsService,
    private breadcrumbService: BreadcrumbService,
    private loggedInUserService: LoggedInUserService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    this.route.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
      this.queryParmas = data;
      this.categoryId = this.queryParmas.CategoryId;
      this.getCategory();
      this.getChildrens();
    });

    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
  }

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Categories', true);

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  getChildrens() {
    this.loading = true;
    if (this.categoryId == undefined) {
      this.isRoot = true;
      return this.categoriesService.getRootsCategories().subscribe(
        (data: any) => {
          this.allCategories = data.data.filter((item) => item.ParentCategoryId == undefined);
          this.loading = false;
        },
        () => {
          this.loading = false;
        },
      );
    } else {
      this.isRoot = false;
      this.categoriesService
        .getAllCategories({ limit: 10000, offset: 0 }, { ParentCategoryId: this.categoryId })
        .subscribe(
          (data) => {
            this.allCategories = [...data.data];
            this.loading = false;
          },
          () => {
            this.loading = false;
          },
        );
    }
  }

  getCategory() {
    if (!this.categoryId) {
      return;
    }
    this.categoriesService.getCategory(this.categoryId).subscribe((data) => {
      this.category = data.data;
      this.lastCategoryId = this.category.ParentCategoryId;
    });
  }

  onEditCategory(category, event: Event): void {
    event.stopPropagation();
    this.categoriesService.getCategory(category.id).subscribe((data) => {
      let dialogRef: MatDialogRef<DialogAddEditCategoriesComponent, any>;
      dialogRef = this.dialog.open(DialogAddEditCategoriesComponent, {
        panelClass: 'app-dialog-add-edit-categories',
        maxWidth: '100vw',
        maxHeight: '100vh',
        data: {
          isEditing: true,
          selectedCategory: data.data,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.getChildrens();
      });
    });
  }

  async onRemoveCategory(categories, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar la categoria?',
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) {
          const data = await Promise.all(categories.map((item) => this.categoriesService.removeCategory(item)));
          this.showToastr.showSucces(this.translate.instant('Users successfully removed'), 'Succes', 7500);
          this.getChildrens();
        }
      } catch (error) {
        this.getChildrens();
      }
    });
  }
  onNavToChildren(categoryId) {
    console.log(categoryId);
    this.router.navigate(['/backend/product/categories'], { queryParams: { CategoryId: categoryId } });
  }

  onCreateCategory(event: Event): void {
    event.stopPropagation();
    let dialogRef: MatDialogRef<DialogAddEditCategoriesComponent, any>;
    dialogRef = this.dialog.open(DialogAddEditCategoriesComponent, {
      panelClass: 'app-dialog-add-edit-categories',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        isEditing: false,
        selectedCategory: null,
        ParentCategoryId: this.categoryId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getChildrens();
    });
  }
}
