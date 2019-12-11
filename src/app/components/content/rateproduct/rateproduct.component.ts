import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormBuilder , FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { UserService } from 'src/app/user.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-rateproduct',
  templateUrl: './rateproduct.component.html',
  styleUrls: ['./rateproduct.component.scss']
})
export class RateproductComponent implements OnInit {
  cname: string;
  scname: string;
  itemId: string;
  masterSuppler: string;
  form: FormGroup;
  public comment: string;
  //public description:string;
  public reviewTitle: string;
  public isRecomended: string;
  public productRating: any;
  ratings: string[] = ["1","2","3","4","5"];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RateproductComponent>,
    public _productservice: ProductService,
    public userService: UserService,
    public _alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) data) {
    //this.description = data.description;
    this.comment = this.comment;
    this.reviewTitle = data.reviewTitle;
    this.isRecomended = data.isRecomended;
    this.productRating = data.productRating;
    this.cname = data.cname;
    this.scname = data.scname;
    this.itemId = data.itemid;
    this.masterSuppler = data.masterSuppler;
  }

  ngOnInit() {
    this.form = this.fb.group({
        comment : this.comment,
        reviewTitle: this.reviewTitle,
        isRecomended: this.isRecomended,
        productRating: this.productRating
        //description: [this.description, []]
    });
  }

  funSubmitReview() {
    try {
     let formJson = JSON.parse(JSON.stringify(this.form.value));
     let isProductRecommend = formJson.isRecomended? 'yes' : 'no';
      this._productservice.submitReview(this.userService.getAuthToken(),this.cname, this.scname, this.itemId, 'us',
        formJson.productRating, formJson.reviewTitle, formJson.comment,this.masterSuppler, isProductRecommend)
      .subscribe(        
        (authResponse: AuthResopnse) => {
          sessionStorage.setItem("authResponse", JSON.stringify(authResponse));
          if (authResponse.statusCode === 200) {
            this._alertService.raiseAlert("Review successfully submitted.");
            this.close();
          } else {
            this._alertService.raiseAlert("Unable to submit your review. Try again..");
            console.log('Failed' + JSON.stringify(authResponse));
          }
        });
    } catch (error) {
      this._alertService.raiseAlert("Unable to submit your review. Try again..");
      console.log(error);
    }
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}