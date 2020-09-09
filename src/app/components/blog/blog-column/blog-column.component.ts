import { IPagination } from './../../../core/classes/pagination.class';
import { UtilsService } from './../../../core/services/utils/utils.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from './../../../../environments/environment';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { BlogService } from '../../backend/services/blog/blog.service';
import { takeUntil } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog-column',
  templateUrl: './blog-column.component.html',
  styleUrls: ['./blog-column.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BlogColumnComponent implements OnInit, OnDestroy {
  loadingSearch = false;
  imageUrl: any = environment.apiUrl;
  searchText = null;
  tags: any[] = [];
  isEmptyArray = false;

  query: IPagination = {
    limit: 5,
    total: 0,
    offset: 0,
    order: '-updatedAt',
    page: 1,
    filter: { filterText: '' },
  };

  blogArray: any[] = [];
  latestArray: any[] = [];
  language: any;
  _unsubscribeAll: Subject<any>;
  queryId = null;

  constructor(
    public dialog: MatDialog,
    private blogService: BlogService,
    private route: ActivatedRoute,
    public utilsService: UtilsService,
    private loggedInUserService: LoggedInUserService,
  ) {
    this._unsubscribeAll = new Subject<any>();
    // ------------------------------------------------
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
    // -------------------------------------------------
  }

  ngOnInit() {
    this.queryId = this.route.snapshot.queryParams;

    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });

    this.getBlogdata();
    this.blogService.getAllArticles({ limit: 3, offset: 0, order: '-updatedAt' }).subscribe(
      (data) => {
        this.latestArray = data.data;
        this.latestArray.map((item) => {
          if (item) {
            this.tags = this.tags.concat(this.tags, item.tags);
          }
        });
        // console.log(this.tags);
        this.prepareTags();
      },
      (error) => {
        this.utilsService.errorHandle(error);
      },
    );
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  public getBlogdata(): void {
    this.loadingSearch = true;
    this.blogService.getAllArticles(this.query).subscribe(
      (data) => {
        this.blogArray = this.blogArray.concat(data.data.flat());
        this.isEmptyArray = this.blogArray.length == 0;
        this.query.offset += data.meta.pagination.count;
        this.query.total = data.meta.pagination.total;
        this.blogArray.map((item) => {
          item.expandable = false;
        });
        this.loadingSearch = false;
        this.navigateToSpecificCard();
      },
      (error) => {
        this.utilsService.errorHandle(error);
        this.loadingSearch = false;
      },
    );
  }

  onGetMore() {
    this.getBlogdata();
  }

  onExpandElement(i) {
    this.blogArray[i].expandable = !this.blogArray[i].expandable;
  }

  onSearchArticle() {
    if (this.searchText !== null) {
      this.query.filter = {
        filterText: this.searchText.toString().trim(),
        properties: ['filter[$or][title][$like]', 'filter[$or][createdAt][$like]', 'filter[$or][text]'],
      };
      this.query.limit = 5;
      this.query.offset = 0;
      this.blogArray = [];
      this.getBlogdata();
    }
  }

  prepareTags() {
    this.tags.sort();
    const temp = [];
    for (let i = 0; i < this.tags.length; i++) {
      if (
        !temp.find((item) => item && this.tags[i] && item.toLowerCase().trim() === this.tags[i].toLowerCase().trim())
      ) {
        temp.push(this.tags[i]);
      }
    }
    this.tags = [...temp];
  }

  navigateToSpecificCard() {
    setTimeout(() => {
      if (this.queryId && this.queryId.id) {
        console.log('TCL: this.queryId', this.queryId);
        const datax = document.getElementById(`element${this.queryId.id}`);
        datax.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          for (let i = 0; i < this.blogArray.length; i++) {
            if (this.blogArray[i].id == this.queryId.id) {
              this.blogArray[i].expandable = true;
              this.queryId = null;
              break;
            }
          }
        }, 250);
      }
    }, 250);
  }
}
