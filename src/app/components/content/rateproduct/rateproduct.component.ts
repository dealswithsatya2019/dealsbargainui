import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormBuilder , FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { AuthResopnse } from 'src/app/models/AuthResponse';

@Component({
  selector: 'app-rateproduct',
  templateUrl: './rateproduct.component.html',
  styleUrls: ['./rateproduct.component.scss']
})
export class RateproductComponent implements OnInit {
  public authToken: string = "";
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
    this.authToken =  sessionStorage.getItem("access_token");
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
    console.log(this.form.value);
    try {

     let formJson = JSON.parse(JSON.stringify(this.form.value));
      //cname?, scname?, itemId?, countryCode?,rating?, reviewTitle?,comment?,masterSuppler?,productRecommended?
      this._productservice.submitReview(this.authToken,this.cname, this.scname, this.itemId, 'us',
        formJson.rating, formJson.reviewTitle, formJson.comment,this.masterSuppler, formJson.productRecommended)
      .subscribe(        
        (authResponse: AuthResopnse) => {
          sessionStorage.setItem("authResponse", JSON.stringify(authResponse));
          if (authResponse.statusCode === 200) {
            console.log('Success' + JSON.stringify(authResponse));
            this.close();
          } else {
            console.log('Failed' + JSON.stringify(authResponse));
          }
        });
    } catch (error) {
      console.log(error);
    }
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
/*
http://localhost:8082/api/v1/reviews/create-review  
{
    "countryCode": "us",
    "category": "books",
    "subcategory": "Crafts  &  hobbies",
    "item_id": "27144044",
    "rating": "4",
    "review_title": "good",
    "comment": "good",
    "master_suppler": "doba",
    "product_recommended": "yes"
}
*/