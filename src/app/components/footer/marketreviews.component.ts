import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    public _productservice: ProductService,
    public userService: UserService,
    public _alertService: AlertService
    ) {
    
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

  funSiteReview() {
    try {
     let formJson = JSON.parse(JSON.stringify(this.form.value));
     if(formJson!=true){
      this._alertService.raiseAlert('Site reveiw under development.');
       return;
     }
     let isProductRecommend = formJson.isRecomended? 'yes' : 'no';
      this._productservice.submitReview(this.userService.getAuthToken(),this.cname, this.scname, this.itemId, 'us',
        formJson.productRating, formJson.reviewTitle, formJson.comment,this.masterSuppler, isProductRecommend)
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