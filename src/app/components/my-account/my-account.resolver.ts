import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/core/services/utils/utils.service';

@Injectable({ providedIn: 'root' })
export class MyAccountResolver implements Resolve<any> {
  constructor(private utilsService: UtilsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.utilsService.getAppConfig().subscribe({
      next: (resp) => {
        if (resp.signUpType == 'normal') {
          this.router.navigate(['/my-account-tcp']);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
