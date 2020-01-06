import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthResopnse } from 'src/app/models/AuthResponse';

@Component({
  selector: 'app-marketreviews',
  templateUrl: './marketreviews.component.html',
  styleUrls: ['./marketreviews.component.scss']
})
export class MarketreviewsComponent implements OnInit {
  form: FormGroup;
  ratings: string[] = ["5","4","3","2","1"];

  constructor(
    private fb: FormBuilder,
    public _productservice: ProductService,
    public userService: UserService,
    public _alertService: AlertService
    ) {
    
  }

  ngOnInit() {
    this.form = this.fb.group({
      firstName : new FormControl(''),
      lastName: new FormControl(''),
      siteRating: new FormControl(''),
      title: new FormControl(''),
      comment: new FormControl(''),
      address: new FormControl('')
    });
  }

  funSiteReview() {
    try {
     let formJson = JSON.parse(JSON.stringify(this.form.value));
      this._productservice.submitSiteReview(formJson.firstName,formJson.lastName,formJson.siteRating, formJson.title, formJson.comment, formJson.address)
      .subscribe(        
        (authResponse: AuthResopnse) => {
          if (authResponse.statusCode === 200) {
            this._alertService.raiseAlert("Site review successfully submitted.");
          } else {
            this._alertService.raiseAlert("Unable to submit your review. Try again..");
            console.log('Failed' + JSON.stringify(authResponse));
          }
        });
    } catch (error) {
      this._alertService.raiseAlert("Unable to submit your site review. Try again..");
      console.log(error);
    }
  }
}