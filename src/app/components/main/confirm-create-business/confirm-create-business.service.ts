import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ConfirmCreateBusinessService {
  url = environment.apiUrl + 'etecsa-sign-up';

  constructor(private httpClient: HttpClient) {
  }

  etecsaSignUp(): Observable<any> {
    return this.httpClient.get<any>(this.url);
  }
}
