import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ShowToastrService } from '../show-toastr/show-toastr.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ShowSnackbarService } from '../show-snackbar/show-snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  urlImage = environment.apiUrl;
  showErrorState = false;

  constructor(
    public sanitizer: DomSanitizer,
    private showToastr: ShowToastrService,
    private translateService: TranslateService,
    private showSnackbar: ShowSnackbarService,
    private httpClient: HttpClient,
  ) {
  }

  /**
   *
   * @param arrayBase Array with All product needed
   * @param arrayIds Array with All Ids to get products
   *
   * Return Array of product
   */
  static getAnArrayFromIdsAndArray(arrayBase: any[], arrayIds: any[]): any[] {
    if (
      !Array.isArray(arrayBase) || !Array.isArray(arrayIds)
    ) {
      return [];
    }

    return arrayIds.map((itemId) =>
      arrayBase.find((itemProduct) =>
        itemProduct.id === itemId),
    );
  }

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
    if (this.showErrorState) {
      return;
    }
    this.showErrorState = true;

    let alternative = nomenclator
      ? action
        ? this.translateService.instant('Error ') + action + ' ' + nomenclator
        : this.translateService.instant('Error ') + action
      : this.translateService.instant(
        `Server response failed, check your connection to the network, or contact the administrators`,
      );
    let msg = alternative;
    if (error.errors && error.errors?.length) {
      msg = error.errors.map(
        (item) => (item.field ? item.field + ' : ' : '') + ' ' + (item.title || item.message + ' '),
      );
    } else if (error.error.errors) {
      msg = error.error.errors.map(
        (item) => (item.field ? item.field + ' : ' : '') + ' ' + (item.title || item.message + ' '),
      );
    } else if (error.error && error.error?.length) {
      msg = error.error.map(
        (item) => (item.field ? item.field + ' : ' : '') + ' ' + (item.title || item.message + ' '),
      );
    } else {
      msg = error.error.message;
    }

    if (error.status >= 300 && error.status < 500) {
      this.showToastr
        .showInfo(msg, 'Error', 5000)
        .toastRef.afterClosed()
        .subscribe((data) => {
          this.showErrorState = false;
        });
    }

    if (error.status >= 500) {
      this.showToastr
        .showError(msg, 'Error', 5000)
        .toastRef.afterClosed()
        .subscribe((data) => {
          this.showErrorState = false;
        });
    }
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
    if (error.errors && error.errors?.length) {
      msg = error.errors.map(
        (item) => (item.field ? item.field + ' : ' : '') + ' ' + (item.title || item.message + ' '),
      );
    } else if (error.error.errors) {
      msg = error.error.errors.map(
        (item) => (item.field ? item.field + ' : ' : '') + ' ' + (item.title || item.message + ' '),
      );
    } else if (error.error && error.error?.length) {
      msg = error.error.map(
        (item) => (item.field ? item.field + ' : ' : '') + ' ' + (item.title || item.message + ' '),
      );
    } else {
      msg = error.error.message;
    }
    this.showSnackbar.showError(msg, 8000);
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(this.urlImage, { responseType: 'blob' });
  }

  parserLanguage(item, language) {
    if (item && language) {
      if (item[language] && item[language]?.length) {
        return item[language];
      } else if (item['en'] && item['en']?.length) {
        return item['en'];
      } else {
        return item['es'];
      }
    } else {
      return;
    }
  }

  public isObjectEquals(x, y): boolean {
    if (x === y) {
      return true;
    }

    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    for (let p in x) {
      if (!x.hasOwnProperty(p)) {
        continue;
      }

      if (!y.hasOwnProperty(p)) {
        return false;
      }

      if (x[p] === y[p]) {
        continue;
      }

      if (typeof x[p] !== 'object') {
        return false;
      }

      if (!this.isObjectEquals(x[p], y[p])) {
        return false;
      }
    }
    for (let p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
  }

  keyPressAlpha(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressNumbers(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressAlphaAndNumbers(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressAlphaAndNumbersModIdentity(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9\-_.]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressAlphaAndNumbersModUsername(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9@.]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyLettersNumberForEmail(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9@._\-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  // keyPressNumbers(event) {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   // Only Numbers 0-9
  //   if ((charCode < 48 || charCode > 57)) {
  //     event.preventDefault();
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  generateUuid(): string {
    let tempId = '';

    tempId = this.generator();

    return tempId;
  }

  private generator(): string {
    const isString = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;

    return isString;
  }

  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
}
