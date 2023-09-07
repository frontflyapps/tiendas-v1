import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ReferredService } from '../../core/services/referred/referred.service';
import { LoggedInUserService } from '../../core/services/loggedInUser/logged-in-user.service';
import { ShowToastrService } from '../../core/services/show-toastr/show-toastr.service';


@Component({
  selector: 'app-referred-layout',
  templateUrl: './referred-layout.component.html',
  styleUrls: ['./referred-layout.component.scss'],
  providers: [ReferredService]
})
export class ReferredLayoutComponent implements OnInit {

  form: UntypedFormGroup;
  urlLink = environment.url + 'my-account?modal=registration';
  data: any;
  hasLink: boolean = true;
  loading = false;
  loggedInUser: any = null;

  constructor(
    private fb: UntypedFormBuilder,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: RouterModule,
    private elementService: ReferredService,
    private loggedInUserService: LoggedInUserService,
    private showToastr: ShowToastrService
  ) {
    this.loggedInUser = this.loggedInUserService.getLoggedInUser();
  }

  ngOnInit(): void {
    this.refreshData();
    this.buildForm();
  }

  buildForm() {
    console.log(this.data?.Codes[0].code);
    const url = this.urlLink + (this.data?.Codes.length > 0 ? this.data?.Codes[0].code : '');
    this.form = this.fb.group({
      link: [url , []],
    });
    console.log(url);
    console.log(this.urlLink);
    console.log(this.form.value);
  }

  refreshData() {
    this.loading = true;
    console.log(this.loggedInUser);
    const data = {
      personId: this.loggedInUser?.id,
    };
    this.elementService.get(data.personId).subscribe({
      next: (user) => {
        if (user) {
          this.data = user.data;
          if (this.data?.Codes.length > 0) {
            this.form.get('link').setValue(this.urlLink + '&ref=' + this.data?.Codes[0].code);
          }
          console.log(this.data);
          this.hasLink = true;
          this.loading = false;
        } else {
          this.hasLink = false;
          this.loading = false;
        }
      },
      error: (error) => {
        this.hasLink = false;
        this.loading = false;
      },
    });
  }

  copyLink() {
    this.showToastr.showSucces(this.translateService.instant('Enlace copiado al portapapeles'));
  }

}
