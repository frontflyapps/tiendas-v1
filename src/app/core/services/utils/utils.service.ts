import { CurrencyService } from 'src/app/core/services/currency/currency.service';
import { IPagination } from '../../classes/pagination.class';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ShowToastrService } from './../show-toastr/show-toastr.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ShowSnackbarService } from '../show-snackbar/show-snackbar.service';
import { CurrencyPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  urlImage = environment.apiUrl;

  constructor(
    public sanitizer: DomSanitizer,
    private showToastr: ShowToastrService,
    private translateService: TranslateService,
    private showSnackbar: ShowSnackbarService,
    private httpClient: HttpClient,
  ) {}

  public getUrlImages(): string {
    return environment.apiUrl;
  }

  public getSafeImage(url: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

  public getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  public safeToDom(data: string) {
    return this.sanitizer.bypassSecurityTrustHtml(data);
  }

  public publicSetDescription(data: any, language) {
    return this.safeToDom(this.parserLanguage(data, language));
  }

  errorHandle(error, nomenclator?, action?) {
    let alternative = nomenclator
      ? action
        ? this.translateService.instant('Error ') + action + ' ' + nomenclator
        : this.translateService.instant('Error ') + action
      : this.translateService.instant(
          `Server response failed, check your connection to the network, or contact the administrators`,
        );
    let msg = alternative;
    if (error.errors && error.errors.length) {
      msg = error.errors.map((item) => (item.field || '') + ' ' + (item.title || item.message + ' '));
    } else if (error.error.errors) {
      msg = error.error.errors.map((item) => (item.field || '') + ' ' + (item.title || item.message + ' '));
    } else if (error.error && error.error.length) {
      msg = error.error.map((item) => (item.field || '') + ' ' + (item.title || item.message + ' '));
    } else {
      msg = error.error.message;
    }
    this.showToastr.showError(msg, 'Error', 9000);
  }

  errorHandle2(error, nomenclator?, action?) {
    let alternative = nomenclator
      ? action
        ? this.translateService.instant('Error ') + action + ' ' + nomenclator
        : this.translateService.instant('Error ') + action
      : this.translateService.instant(
          `Server response failed, check your connection to the network, or contact the administrators`,
        );
    let msg = alternative;
    if (error.errors && error.errors.length) {
      msg = error.errors.map((item) => (item.field || '') + ' ' + (item.title || item.message + ' '));
    } else if (error.error.errors) {
      msg = error.error.errors.map((item) => (item.field || '') + ' ' + (item.title || item.message + ' '));
    } else if (error.error && error.error.length) {
      msg = error.error.map((item) => (item.field || '') + ' ' + (item.title || item.message + ' '));
    } else {
      msg = error.error.message;
    }
    this.showSnackbar.showError(msg, 8000);
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(this.urlImage, { responseType: 'blob' });
  }

  parserLanguage(item, language) {
    // console.log(item, 'asdljhaskdgaskdgsj');
    if (item[language] && item[language].length) {
      return item[language];
    } else if (item['en'] && item['en'].length) {
      return item['en'];
    } else {
      return item['es'];
    }
  }
}
