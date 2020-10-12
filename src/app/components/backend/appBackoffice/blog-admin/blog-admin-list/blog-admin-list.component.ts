import { ConfirmationDialogComponent } from './../../../common-dialogs-module/confirmation-dialog/confirmation-dialog.component';
import { IPagination } from 'src/app/core/classes/pagination.class';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreadcrumbService } from '../../../common-layout-components/breadcrumd/service/breadcrumb.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BlogService } from '../../../services/blog/blog.service';
import { UtilsService } from 'src/app/core/services/utils/utils.service';
import { Subject } from 'rxjs';
import { LoggedInUserService } from 'src/app/core/services/loggedInUser/logged-in-user.service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-blog-admin-list',
  templateUrl: './blog-admin-list.component.html',
  styleUrls: ['./blog-admin-list.component.scss'],
})
export class BlogAdminListComponent implements OnInit, OnDestroy {
  loadingSearch = false;
  imageUrl: any = environment.apiUrl;
  initialPage = 10;
  query: IPagination = {
    limit: this.initialPage,
    total: 0,
    offset: 0,
    order: '-updatedAt',
    page: 1,
    filter: { filterText: '' },
  };

  blogArray: any[] = [];
  language: any;
  _unsubscribeAll: Subject<any>;

  pageSizeOptions: number[] = [this.initialPage, 25, 100, 1000];
  searchElementCount = 0;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    public dialog: MatDialog,
    private blogService: BlogService,
    public utilsService: UtilsService,
    private loggedInUserService: LoggedInUserService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
  }

  ngOnInit() {
    this.breadcrumbService.clearBreadcrumd();
    this.breadcrumbService.setBreadcrumd('Lista de publicaciones', true);
    this.getBlogdata();

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  onEditArticle(id) {
    this.router.navigate(['backend/blog/edit', id]);
  }

  onDeleteArticle(article) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación',
        question: '¿Está seguro que desea eliminar la publicación?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.blogService
          .removeBlog(article)
          .then(() => {
            this.query.limit = 5;
            this.query.offset = 0;
            this.query.total = 0;
            this.blogArray = [];
            this.getBlogdata();
          })
          .catch((error) => {
            this.utilsService.errorHandle(error);
          });
      }
    });
  }

  public getBlogdata(): void {
    this.loadingSearch = true;
    this.blogService.getAllArticles(this.query).subscribe(
      (data) => {
        this.blogArray = data.data;
        this.query.total = data.meta.pagination.total;
        this.loadingSearch = false;
        setTimeout(() => {
          for (let blogItem of this.blogArray) {
            let element = document.getElementById(`textContent${blogItem.id}`);
            element.innerHTML = this.utilsService.parserLanguage(blogItem.text, this.language);
            blogItem.expandable = false;
          }
        }, 250);
      },

      (error) => {
        this.utilsService.errorHandle(error);
        this.loadingSearch = false;
      },
    );
  }

  onExpand(item) {
    let element = document.getElementById(`expandibleDetails${item.id}`);
    if (!item.expandable) {
      element.classList.remove('hidden-details');
      element.classList.add('show-details');
    } else {
      element.classList.remove('show-details');
      element.classList.add('hidden-details');
    }
    item.expandable = !item.expandable;
  }

  onGetMore() {
    this.getBlogdata();
  }

  onSearch(searchvalue) {
    if (searchvalue && searchvalue !== '') {
      this.query.filter.filterText = searchvalue.toString().trim();
      this.query.filter.properties = [];
      this.query.filter.properties.push('filter[$or][title][$like]');
    } else {
      this.query.filter.filterText = '';
    }
    this.getBlogdata();
    this.paginator.firstPage();
  }

  //////////////////// Pagination Api ////////////////////////////
  OnPaginatorChange(event) {
    if (event) {
      this.query.limit = event.pageSize || this.initialPage;
      this.query.offset = event.pageIndex * event.pageSize;
      this.query.page = event.pageIndex;
    } else {
      this.query.limit = this.initialPage;
      this.query.offset = 0;
      this.query.page = 1;
    }
    this.getBlogdata();
  }
  ////////////////////////////////////////////////////////
}
