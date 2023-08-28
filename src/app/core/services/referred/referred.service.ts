import { environment } from '../../../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { RestFullService } from '../rest-full.service';

@Injectable()
export class ReferredService extends RestFullService<any> {
  url = environment.apiUrl + 'referrer';
  urlId = environment.apiUrl + 'referrer/:id';

  constructor(injector: Injector) {
    super(injector);
  }
}
