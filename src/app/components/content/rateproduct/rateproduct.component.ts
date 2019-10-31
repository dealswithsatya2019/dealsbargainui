import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormBuilder , FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rateproduct',
  templateUrl: './rateproduct.component.html',
  styleUrls: ['./rateproduct.component.scss']
})
export class RateproductComponent implements OnInit {

  form: FormGroup;
  public description:string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RateproductComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.description = data.description;
  }

  ngOnInit() {
    this.form = this.fb.group({
        description: [this.description, []],
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
