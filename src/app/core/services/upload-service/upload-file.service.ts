import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscriber, Subject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IPagination } from '../../../core/classes/pagination.class';
import { LoggedInUserService } from '../loggedInUser/logged-in-user.service';

// Get product from Localstorage
//let products = JSON.parse(localStorage.getItem('compareItem')) || [];

@Injectable({
  providedIn: 'root',
})
export class UploadFilesService {
  $uploadFileStart = new Subject<any>();
  $uploadFileEnd = new Subject<any>();
  $uploadProgress = new Subject<any>();

  url = environment.apiUrlRepositoy + 'file';
  urlFileUuid = environment.apiUrlRepositoy + 'file-uuid';
  urlGetUrl = environment.apiUrlRepositoy + 'get-url';
  urlId = environment.apiUrlRepositoy + 'file/:id';

  httpOptions = {};
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

  emitUploadProgress(data) {
    this.$uploadProgress.next(data);
  }

  upload(formData, uuidParam, id) {
    return this.httpClient.post<any>(this.url, formData, {
      headers: new HttpHeaders({
        uuid: uuidParam,
        fileId: id + '',
        // Authorization: this.urlTokenUpload,
        // noNewToken: '1',
      }),
      reportProgress: true,
      observe: 'events',
    });
  }

  getUrlFile(uuidParam, id) {
    return this.httpClient.get<any>(this.urlGetUrl, {
      headers: new HttpHeaders({
        uuid: uuidParam,
        fileId: id + '',
        // noNewToken: '1',
        // Authorization: this.urlTokenUpload,
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
    return this.httpClient.delete<any>(this.urlId.replace(':id', id), this.httpOptions);
  }

  get(data): Observable<any> {
    return this.httpClient.get(this.urlId.replace(':id', data));
  }

  getUuid(): Observable<any> {
    return this.httpClient.post(this.urlFileUuid, {});
  }
}
