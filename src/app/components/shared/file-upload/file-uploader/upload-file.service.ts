import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';

import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  // urlFile = environment.apiUrl + 'file';
  urlFile = environment.apiUrl + 'file';
  urlCircular = environment.apiUrl + 'circular-price';
  urlVersatIntegration = environment.apiUrl + 'versat-integration';
  urlProductFile = environment.apiUrl + 'upload-digital-product';
  urlDataSheetFile = environment.apiUrl + 'upload-data-sheet';
  urlPrescriptionImageFile = environment.apiUrl + 'cart/upload-prescription-url';

  constructor(private httpClient: HttpClient) {}

  // public createFile(data, productId): Observable<any> {
  //   let headers = new HttpHeaders().set('ProductId', productId.toString());

  //   return this.httpClient.post<any>(this.urlProductFile, data, {
  //     headers,
  //     reportProgress: true,
  //     observe: 'events',
  //   });
  // }

  public createProductFile(data, productId): Observable<any> {
    let headers;
    if (productId != undefined) {
      headers = new HttpHeaders().set('ProductId', productId.toString());
    }

    return this.httpClient.post<any>(this.urlProductFile, data, {
      headers,
      reportProgress: true,
      observe: 'events',
    });
  }

  public createDataSheetFile(data, productId): Observable<any> {
    let headers;
    if (productId != undefined) {
      headers = new HttpHeaders().set('ProductId', productId.toString());
    }

    console.log(data);

    return this.httpClient.post<any>(this.urlDataSheetFile, data, {
      headers,
      reportProgress: true,
      observe: 'events',
    });
  }

  public createPrescriptionImageFile(data, productId): Observable<any> {
    let headers;
    if (productId != undefined) {
      headers = new HttpHeaders().set('ProductId', productId.toString());
    }

    console.log(data);

    return this.httpClient.post<any>(this.urlPrescriptionImageFile, data, {
      headers,
      reportProgress: true,
      observe: 'events',
    });
  }

  public createCircularFile(data): Observable<any> {
    return this.httpClient.patch<any>(this.urlCircular, data, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public createVersatFile(data): Observable<any> {
    return this.httpClient.post<any>(this.urlVersatIntegration, data, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public createFile(data): Observable<any> {
    console.log(data, 'la data que llega al servicio');
    return this.httpClient.post<any>(this.urlCircular, data, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public createProductFileLink(data): Observable<any> {
    return this.httpClient.post<any>(this.urlProductFile + '/link', data);
  }

  public createFileLink(data): Observable<any> {
    return this.httpClient.post<any>(this.urlFile + '/link', data);
  }

  public getAllFiles(query, params?): Observable<any> {
    let httpParams = new HttpParams();
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
      if (params.fkModel) {
        httpParams = httpParams.set('filter[$and][fkModel]', params.fkModel);
      }
      if (params.fkId) {
        httpParams = httpParams.set('filter[$and][fkId]', params.fkId);
      }
    }
    return this.httpClient.get<any>(this.urlFile, { params: httpParams });
  }

  public editFile(data) {
    return this.httpClient.patch<any>(this.urlFile + `/${data.id}`, data);
  }

  public removeFile(id): Observable<any> {
    return this.httpClient.delete<any>(this.urlFile + `/${id}`);
  }
}
