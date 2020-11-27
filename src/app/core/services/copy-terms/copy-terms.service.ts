import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CopyTermsService {
  urlTerms = environment.apiUrl + 'term-conditions';
  urlCopy = environment.apiUrl + 'copy-right';

  constructor(private httpClient: HttpClient) { }

  public getTermsConditions(): Observable<any> {
    return this.httpClient.get(this.urlTerms) as Observable<any>;
  }
  public getCopyRight(): Observable<any> {
    return this.httpClient.get(this.urlCopy) as Observable<any>;
  }
}
