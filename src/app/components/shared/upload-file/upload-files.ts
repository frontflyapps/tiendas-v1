import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable }                          from '@angular/core';
import * as moment                             from 'moment';
import { Observable, Subject }                 from 'rxjs';
import { environment }                         from '../../../../environments/environment';
import { IPagination }                         from '../../../core/classes/pagination.class';

import { LoggedInUserService } from '../../../core/services/loggedInUser/logged-in-user.service';

@Injectable({
  providedIn: 'root',
})
export class UploadFilesService {
  $uploadFileStart = new Subject<any>();
  $uploadFileEnd   = new Subject<any>();

  url         = environment.apiUrl + 'file';
  urlMyFile   = environment.apiUrl + 'my-files';
  urlBuyFile  = environment.apiUrl + 'my-allowed-files';
  urlFileUuid = environment.apiUrl + 'file-uuid';
  urlGetUrl   = environment.apiUrl + 'get-url';
  urlId       = environment.apiUrl + 'file/:id';

  httpOptions           = {};
  selectedContract: any = {};

  constructor(private httpClient: HttpClient, private loggedInUserService: LoggedInUserService) {
    this.loggedInUserService = loggedInUserService;

    this.httpOptions = {};
  }

  emitUploadStart(data) {
    this.$uploadFileStart.next(data);
  }

  emitUploadEnd(data) {
    this.$uploadFileEnd.next(data);
  }

  upload(formData, uuidParam, id) {
    console.log('***************', id);

    return this.httpClient.post<any>(this.url, formData, {
      headers       : new HttpHeaders({
        uuid  : uuidParam,
        fileId: id + '',
      }),
      reportProgress: true,
      observe       : 'events',
    });
  }

  getUrlFile(uuidParam, id) {
    return this.httpClient.get<any>(this.urlGetUrl, {
      headers: new HttpHeaders({
        uuid  : uuidParam,
        fileId: id + '',
      }),
    });
  }

  create(contract: any): Observable<any> {
    return this.httpClient.post<any>(this.url, contract);
  }

  edit(id, data) {
    return this.httpClient.patch<any>(this.urlId.replace(':id', id), data, this.httpOptions);
  }

  remove(id) {
    console.log(id);
    return this.httpClient.delete<any>(this.urlId.replace(':id', id), this.httpOptions);
  }

  get(data): Observable<any> {
    return this.httpClient.get(this.urlId.replace(':id', data));
  }

  getUuid(): Observable<any> {
    return this.httpClient.post(this.urlFileUuid, {});
  }

  getAll(query?: IPagination, params?: any) {
    let httpParams = new HttpParams();
    let startDate;
    let endDate;
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());

      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(item, '%' + query.filter.filterText + '%');
        });
      }

      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }

    if (params) {
      if (params.endDate && params.startDate) {
        endDate    = moment(params.endDate.toISOString()).utc(true).format('YYYY-MM-DD') + 'T23:59:59.999Z';
        startDate  = moment(params.startDate.toISOString()).utc(true).format('YYYY-MM-DD') + 'T00:00:00.000Z';
        httpParams = httpParams.append('filter[$and][createdAt][$gte]', startDate);
        httpParams = httpParams.append('filter[$and][createdAt][$lte]', endDate ? endDate : startDate);
      }

      if (params.name) {
        httpParams = httpParams.append('filter[$and][name][$like]', '%' + params.name + '%');
      }
      if (params.mimeType) {
        httpParams = httpParams.append('filter[$and][mimeType][$like]', '%' + params.mimeType + '%');
      }

      if (params.minValue !== undefined && params.maxValue !== undefined) {
        httpParams = httpParams.append('filter[$and][size][$gte]', params.minValue);
        httpParams = httpParams.append('filter[$and][size][$lte]', params.maxValue);
      }
      if (params.Creator) {
        httpParams = httpParams.append('filter[$and][CreatorId]', params.Creator);
      }
      if (params.description) {
        httpParams = httpParams.append('filter[$and][description][$like]', '%' + params.description + '%');
      }
    }

    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getAllBuyFile(query?: IPagination, params?: any) {
    let httpParams = new HttpParams();
    let startDate;
    let endDate;
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());

      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(item, '%' + query.filter.filterText + '%');
        });
      }

      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }

    if (params) {
      if (params.endDate && params.startDate) {
        endDate    = moment(params.endDate.toISOString()).utc(true).format('YYYY-MM-DD') + 'T23:59:59.999Z';
        startDate  = moment(params.startDate.toISOString()).utc(true).format('YYYY-MM-DD') + 'T00:00:00.000Z';
        httpParams = httpParams.append('filter[$and][createdAt][$gte]', startDate);
        httpParams = httpParams.append('filter[$and][createdAt][$lte]', endDate ? endDate : startDate);
      }

      if (params.name) {
        httpParams = httpParams.append('filter[$and][File][name][$like]', '%' + params.name + '%');
      }
      if (params.mimeType) {
        httpParams = httpParams.append('filter[$and][File][mimeType][$like]', '%' + params.mimeType + '%');
      }

      if (params.minValue !== undefined && params.maxValue !== undefined) {
        httpParams = httpParams.append('filter[$and][File][size][$gte]', params.minValue);
        httpParams = httpParams.append('filter[$and][File][size][$lte]', params.maxValue);
      }
      if (params.Creator) {
        httpParams = httpParams.append('filter[$and][CreatorId]', params.Creator);
      }
      if (params.description) {
        httpParams = httpParams.append('filter[$and][File][description][$like]', '%' + params.description + '%');
      }
    }

    return this.httpClient.get<any>(this.urlBuyFile, { params: httpParams });
  }

  getMyFilesAll(query?: IPagination, params?: any) {
    let httpParams = new HttpParams();
    let startDate;
    let endDate;
    if (query) {
      httpParams = httpParams.append('limit', query.limit.toString());
      httpParams = httpParams.append('offset', query.offset.toString());

      if (query.filter && query.filter.properties) {
        query.filter.properties.forEach((item) => {
          httpParams = httpParams.append(item, '%' + query.filter.filterText + '%');
        });
      }

      if (query.order) {
        httpParams = httpParams.append('order', query.order);
      }
    } else {
      httpParams = httpParams.set('limit', '0');
      httpParams = httpParams.set('offset', '0');
    }

    if (params) {
      if (params.endDate && params.startDate) {
        endDate    = moment(params.endDate.toISOString()).utc(true).format('YYYY-MM-DD') + 'T23:59:59.999Z';
        startDate  = moment(params.startDate.toISOString()).utc(true).format('YYYY-MM-DD') + 'T00:00:00.000Z';
        httpParams = httpParams.append('filter[$and][createdAt][$gte]', startDate);
        httpParams = httpParams.append('filter[$and][createdAt][$lte]', endDate ? endDate : startDate);
      }

      if (params.name) {
        httpParams = httpParams.append('filter[$and][name][$like]', '%' + params.name + '%');
      }
      if (params.mimeType) {
        httpParams = httpParams.append('filter[$and][mimeType][$like]', '%' + params.mimeType + '%');
      }

      if (params.minValue !== undefined && params.maxValue !== undefined) {
        httpParams = httpParams.append('filter[$and][size][$gte]', params.minValue);
        httpParams = httpParams.append('filter[$and][size][$lte]', params.maxValue);
      }
      if (params.Creator) {
        httpParams = httpParams.append('filter[$and][CreatorId]', params.Creator);
      }
      if (params.description) {
        httpParams = httpParams.append('filter[$and][description][$like]', '%' + params.description + '%');
      }
    }

    return this.httpClient.get<any>(this.urlMyFile, { params: httpParams });
  }

  getAllAll(params?: any) {
    let startDate;
    let endDate;
    let httpParams = new HttpParams();
    httpParams     = httpParams.set('limit', '0');
    httpParams     = httpParams.set('offset', '0');
    if (params) {
      if (params.name) {
        httpParams = httpParams.append('filter[$and][name][$like]', '%' + params.name + '%');
      }
      if (params.domain) {
        httpParams = httpParams.append('filter[$and][domain][$like]', '%' + params.domain + '%');
      }
      if (params.syncUrl) {
        httpParams = httpParams.append('filter[$and][syncUrl][$like]', '%' + params.syncUrl + '%');
      }
      if (params.description) {
        httpParams = httpParams.append('filter[$and][description][$like]', '%' + params.description + '%');
      }

      endDate    = moment(params.endDate.toISOString()).utc(true).format('YYYY-MM-DD') + 'T23:59:59.999Z';
      startDate  = moment(params.startDate.toISOString()).utc(true).format('YYYY-MM-DD') + 'T00:00:00.000Z';
      httpParams = httpParams.append('filter[$and][createdAt][$gte]', startDate);
      httpParams = httpParams.append('filter[$and][createdAt][$lte]', endDate ? endDate : startDate);
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

}
