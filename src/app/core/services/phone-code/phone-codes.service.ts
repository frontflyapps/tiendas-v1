import { environment }            from '../../../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { RestFullService } from '../rest-full.service';

@Injectable()
export class PhoneCodeService extends RestFullService<any> {
  url = environment.apiUrl + 'calling-code';
  urlId = environment.apiUrl + 'calling-code/:id';

  constructor(injector: Injector) {
    super(injector);
  }
}
