import { IPagination } from './../../../../core/classes/pagination.class';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from './../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  url = environment.apiUrl + 'blog';
  urlId = environment.apiUrl + 'blog/:blogId';
  httpOptions = {};

  constructor(private httpClient: HttpClient) {}

  createBlog(body: any): Observable<any> {
    return this.httpClient.post<any>(this.url, body);
  }

  editBlog(data) {
    return this.httpClient.patch<any>(this.urlId.replace(':blogId', data.id), data, this.httpOptions);
  }

  removeBlog(data): Promise<any> {
    return this.httpClient.delete<any>(this.urlId.replace(':blogId', data.id), this.httpOptions).toPromise();
  }

  getAllArticles(query?: IPagination, params?: any) {
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
    }
    return this.httpClient.get<any>(this.url, { params: httpParams });
  }

  getBlog(data: any): Observable<any> {
    if (data.constructor === 'Object') {
      return this.httpClient.get<any>(this.urlId.replace(':blogId', data.id), this.httpOptions);
    } else {
      return this.httpClient.get<any>(this.urlId.replace(':blogId', data + ''), this.httpOptions);
    }
  }
}
