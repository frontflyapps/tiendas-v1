import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EMAIL_REGEX } from '../../../core/classes/regex.const';
import { PhoneCodeService } from '../../../core/services/phone-code/phone-codes.service';
import { UtilsService } from '../../../core/services/utils/utils.service';

@Component({
  selector: 'app-dialog-phone',
  templateUrl: './dialog-phone.component.html',
  styleUrls: ['./dialog-phone.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PhoneCodeService],
})
export class DialogPhoneComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogPhoneComponent>,
    private fb: UntypedFormBuilder,
    public phoneCodesService: PhoneCodeService,
    public utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  public form: UntypedFormGroup;
  callingCodeDisplayOptions = {
    firthLabel: [
      {
        type: 'path',
        path: ['code'],
      },
    ],
  };

  ngOnInit(): void {
    console.log(this.data);
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      phone: [this.data?.phone ?? null, [Validators.required]],
      PhoneCallingCodeId: [this.data?.PhoneCallingCodeId ?? null, [Validators.required]],
    });
    console.log(this.form.value);
  }

  public validate() {
    return this.form.invalid;
  }

  public onSave() {

  }

}
