import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AuthResopnse2 } from 'src/app/models/ApiResponse2';
import { ReviewRatingsInfo } from 'src/app/models/ReviewRatingInfo';

@Component({
  selector: 'app-product-ratings-list',
  templateUrl: './product-ratings-list.component.html',
  styleUrls: ['./product-ratings-list.component.scss']
})
export class ProductRatingsListComponent implements OnInit {

  public pid: string = "";
  public reviewsList: Array<ReviewRatingsInfo> = [];
  constructor(private _Activatedroute: ActivatedRoute,
    public _productservice: ProductService,
    public _router: Router) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe((params: ParamMap) => {
      this.pid = params.get('pid');
      this._productservice.getProductReviewANdRatingsById(this.pid, 'us', 0, 20).subscribe(
        (results: AuthResopnse2) => {
          if (results.responseObjects && results.responseObjects.reviewdetails) {
            this.reviewsList = results.responseObjects.reviewdetails;
          }
        },
        (error) => {
          console.log(error);
        });
    });
  }
}