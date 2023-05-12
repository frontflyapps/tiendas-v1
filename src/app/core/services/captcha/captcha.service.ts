import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  urlUuid = environment.apiUrl + 'captcha/confirm/:uuid';
  urlHash = environment.apiUrl + 'captcha/confirm/:hash';
  httpOptions           = {};

  constructor(private httpClient: HttpClient) {
    this.httpOptions = {};
  }

  confirmCaptcha(data) {
    console.log(data);
    return this.httpClient.post<any>(this.urlUuid.replace(':uuid', data.uuid), data, this.httpOptions);
  }

  getCaptcha(data) {
    console.log(data);
    return this.httpClient.patch<any>(this.urlUuid.replace(':uuid', data.uuid), data, this.httpOptions);
  }

}
