import { UtilsService } from './../../../core/services/utils/utils.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoggedInUserService } from './../../../core/services/loggedInUser/logged-in-user.service';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-banners-four',
  templateUrl: './banners-four.component.html',
  styleUrls: ['./banners-four.component.scss'],
})
export class BannersFourComponent implements OnInit, OnDestroy {
  @Input()
  set _banners(value) {
    this.banners = [...value];
  }

  banners: any[] = [];
  _unsubscribeAll: Subject<any>;
  language = null;
  urlImage = environment.apiUrl;

  constructor(private loggedInUserService: LoggedInUserService, public utilsService: UtilsService) {
    this._unsubscribeAll = new Subject<any>();
    this.language = this.loggedInUserService.getLanguage() ? this.loggedInUserService.getLanguage().lang : 'es';
  }

  ngOnInit() {
    this.loggedInUserService.$languageChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe((data: any) => {
      this.language = data.lang;
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }

  public getBanner(index) {
    return this.banners[index];
  }

  public getBgImage(index) {
    let bgImage = {
      'background-image':
        index != null
          ? 'url(' + this.banners[index].image + ')'
          : 'url(https://via.placeholder.com/600x400/ff0000/fff/)',
    };
    return bgImage;
  }
}
