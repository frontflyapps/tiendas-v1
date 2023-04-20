import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-prescription',
  templateUrl: './dialog-prescription.component.html',
  styleUrls: ['./dialog-prescription.component.scss']
})
export class DialogPrescriptionComponent implements OnInit {

  public form: UntypedFormGroup;

  measures = [
    {
      viewValue: '0.25',
      value: '0.25'
    },
    {
      viewValue: '0.50',
      value: '0.25'
    },
    {
      viewValue: '0.75',
      value: '0.25'
    },
    {
      viewValue: '1.00',
      value: '0.25'
    },
    {
      viewValue: '1.25',
      value: '0.25'
    },
    {
      viewValue: '1.50',
      value: '0.25'
    },
    {
      viewValue: '1.75',
      value: '0.25'
    },
    {
      viewValue: '2.00',
      value: '0.25'
    },
    {
      viewValue: '2.25',
      value: '0.25'
    },
    {
      viewValue: '2.50',
      value: '0.25'
    },
    {
      viewValue: '2.75',
      value: '0.25'
    },
    {
      viewValue: '3.00',
      value: '0.25'
    },
    {
      viewValue: '0.25',
      value: '0.25'
    },
    {
      viewValue: '0.50',
      value: '0.25'
    },
    {
      viewValue: '0.75',
      value: '0.25'
    },
    {
      viewValue: '1.00',
      value: '0.25'
    },
    {
      viewValue: '1.25',
      value: '0.25'
    },
    {
      viewValue: '1.50',
      value: '0.25'
    },
    {
      viewValue: '1.75',
      value: '0.25'
    },
    {
      viewValue: '2.00',
      value: '0.25'
    },
    {
      viewValue: '2.25',
      value: '0.25'
    },
    {
      viewValue: '2.50',
      value: '0.25'
    },
    {
      viewValue: '2.75',
      value: '0.25'
    },
    {
      viewValue: '3.00',
      value: '0.25'
    },
    {
      viewValue: '0.25',
      value: '0.25'
    },
    {
      viewValue: '0.50',
      value: '0.25'
    },
    {
      viewValue: '0.75',
      value: '0.25'
    },
    {
      viewValue: '1.00',
      value: '0.25'
    },
    {
      viewValue: '1.25',
      value: '0.25'
    },
    {
      viewValue: '1.50',
      value: '0.25'
    },
    {
      viewValue: '1.75',
      value: '0.25'
    },
    {
      viewValue: '2.00',
      value: '0.25'
    },
    {
      viewValue: '2.25',
      value: '0.25'
    },
    {
      viewValue: '2.50',
      value: '0.25'
    },
    {
      viewValue: '2.75',
      value: '0.25'
    },
    {
      viewValue: '3.00',
      value: '0.25'
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogPrescriptionComponent>,
    private fb: FormBuilder,
    private translateService: TranslateService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  selectEye(element) {
    console.log(element);
  }

  createForm() {
    this.form = this.fb.group({
      left: [null, [Validators.required, Validators.pattern('^[+|-]([1-9][0-9]|[1-9])\.(00|25|50|75)$|^[+|-]0\.(25|50|75)$')]],
      cylinderLeft: [null, [Validators.pattern('^[+|-]([1-9][0-9]|[1-9])\.(00|25|50|75)$|^[+|-]0\.(25|50|75)$')]],
      axisLeft: [null, [Validators.pattern('^[+|-]([1-9][0-9]|[1-9])\.(00|25|50|75)$|^[+|-]0\.(25|50|75)$')]],
      right: [null, [Validators.required, Validators.pattern('^[+|-]([1-9][0-9]|[1-9])\.(00|25|50|75)$|^[+|-]0\.(25|50|75)$')]],
      cylinderRight: [null, [Validators.pattern('^[+|-]([1-9][0-9]|[1-9])\.(00|25|50|75)$|^[+|-]0\.(25|50|75)$')]],
      axisRight: [null, [Validators.pattern('^[+|-]([1-9][0-9]|[1-9])\.(00|25|50|75)$|^[+|-]0\.(25|50|75)$')]],
      pupillaryDistance: [null, [Validators.pattern('^[+|-]([1-9][0-9]|[1-9])\.(00|25|50|75)$|^[+|-]0\.(25|50|75)$')]],
    });
  }

  closeWithoutPrescription() {
    console.log('closeWithoutPrescription');
  }

  close() {
    console.log('close');
  }

}
