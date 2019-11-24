import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  constructor(public matDialogRef:MatDialogRef<ForgotpasswordComponent>) { }
  funClose() {
    this.matDialogRef.close();
  }
  ngOnInit() {
  }

}
