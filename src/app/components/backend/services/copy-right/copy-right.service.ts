import {
  environment
} from './../../../../../environments/environment';
import {
  IPagination
} from './../../../../core/classes/pagination.class';
import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CopyRightService {
  url = environment.apiUrl + 'copy-right';
  urlId = environment.apiUrl + 'copy-right/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createCopyRight(body: any): Observable < any > {
    return this.httpClient.post < any > (this.url, body);
  }

  editCopyRight(data) {
    return this.httpClient.patch < any > (this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeCopyRight(data): Promise < any > {
    return this.httpClient.delete < any > (this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllCopyRights(query ? : IPagination, params ? : any) {
    let httpParams = new HttpParams();
    if (query) {
      Object.keys(query).map((keyQuery) => {
        if (query[keyQuery] != undefined && keyQuery !== "filter") {
          httpParams = httpParams.append(keyQuery, query[keyQuery] + "");
        }
      });
      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(
            item,
            "%" + query.filter.filterText + "%"
          );
        });
      }
    }
    if (params) {

      if (params.text != undefined) {
        httpParams = httpParams.set(
          'filter[$and][text][$like]', '%' + params.text.toString() + '%');
      }
    }
    return this.httpClient.get < any > (this.url, {
      params: httpParams
    });
  }

  getCopyRight(data: any): Observable < any > {
    if (data.constructor == Object) {
      return this.httpClient.get < any > (this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get < any > (this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}
