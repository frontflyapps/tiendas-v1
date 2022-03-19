import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  url = environment.apiUrl + 'setting';
  urlId = environment.apiUrl + 'setting/:bannerId';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {
  }

  getSetting(): Observable<any> {
    return this.httpClient.get(this.url);
  }

  editSettings(data): Observable<any> {
    return this.httpClient.patch(this.url, data);
  }
}
