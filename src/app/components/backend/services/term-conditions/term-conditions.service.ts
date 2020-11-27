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
export class TermConditionsService {
  url = environment.apiUrl + 'term-conditions';
  urlId = environment.apiUrl + 'term-conditions/:id';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createTermConditions(body: any): Observable < any > {
    return this.httpClient.post < any > (this.url, body);
  }

  editTermConditions(data) {
    return this.httpClient.patch < any > (this.urlId.replace(':id', data.id), data, this.httpOptions);
  }

  removeTermConditions(data): Promise < any > {
    return this.httpClient.delete < any > (this.urlId.replace(':id', data.id), this.httpOptions).toPromise();
  }

  getAllTermConditionss(query ? : IPagination, params ? : any) {
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
      if (params.status != undefined) {
        if (params.status.constructor != Array) {
          httpParams = httpParams.set(
            'filter[$and][status]',
            params.status.toString()
          );
        }
        if (params.status.constructor == Array && params.status.length) {
          if (params.status.length == 1) {
            httpParams = httpParams.set(
              'filter[$and][status]',
              params.status[0].toString()
            );
          } else {
            params.status.map((item) => {
              httpParams = httpParams.append(
                'filter[$and][status]',
                item.toString()
              );
            });
          }
        }
      }
    }
    return this.httpClient.get < any > (this.url, {
      params: httpParams
    });
  }

  getTermConditions(data: any): Observable < any > {
    if (data.constructor == Object) {
      return this.httpClient.get < any > (this.urlId.replace(':id', data.id), this.httpOptions);
    } else {
      return this.httpClient.get < any > (this.urlId.replace(':id', data + ''), this.httpOptions);
    }
  }
}
