import { Component, OnInit,  AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { RateproductComponent } from '../rateproduct/rateproduct.component';
import { Swiper, Navigation, Pagination, Scrollbar, Autoplay, Thumbs } from 'swiper/js/swiper.esm.js';
import { ProductDetails } from 'src/app/models/ProductDetails';
import { Gallery, GalleryItem, ImageItem,  GalleryConfig } from '@ngx-gallery/core';
import { UserService } from 'src/app/user.service';
import { CartService } from 'src/app/services/cart.service';
import { KeyValuePair } from 'src/app/models/KeyValuePair';
import { ProductRouteInfo } from 'src/app/models/ProductRouteInfo';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResopnse } from 'src/app/models/AuthResponse';
import { AuthResopnse2 } from 'src/app/models/ApiResponse2';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay, Thumbs]);


@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss']
})
export class ProductdetailsComponent implements OnInit, AfterViewInit {

  //https://ngx-gallery-cors-error.stackblitz.io
  //Using loadingMode: 'indeterminate' on the GalleryModule's config worked.
  public PRICE_PREFIX: string = environment.PRICE_PREFIX;

  paidFor: boolean = false;
  public productDetails: ProductDetails = new ProductDetails();
  public product: Product = new Product();
  public similarProducts: Product[];
  public myThumbnail = "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
  public myFullresImage = "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";
  public prodListRouteInfo: ProductRouteInfo;
  public cname: string;
  public scname: string;
  public pid: string;
  items: Array<GalleryItem> = [];
  product_attributes: Array<KeyValuePair> = [];
  productRating: number = 0;
  public FiveStar: number = 0;
  public FourStar: number = 0;
  public ThreeStar: number = 0;
  public TwoStar: number = 0;
  public OneStar: number = 0;
  public FiveStarPercent: number =0;
  public FourStarPercent: number =0;
  public ThreeStarPercent: number =0;
  public TwoStarPercent: number =0;
  public OneStarPercent: number =0;
  public isProductAvailable: boolean = false;
  subscription: Subscription;
  public whishlist_action_type: string = 'add';
  public result: string = '';
  public totalRating: number = 0;

  constructor(private _Activatedroute: ActivatedRoute, public _productservice: ProductService,
    public _router: Router, public dialog: MatDialog, public gallery: Gallery,
    public userservice: UserService, private cartService: CartService) {
  }

  ngOnInit() {
    setTimeout(() => {
      var swiper = new Swiper('.similar', {
        autoplay: {
          delay: 3000,
        },
        spaceBetween: 20,
        speed: 500,
        slidesPerView: 5,
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          550: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1288: {
            slidesPerView: 5,
          }
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      })
    }, 1000);


    this._Activatedroute.paramMap.subscribe((params: ParamMap) => {
      this.cname = params.get('cname');
      this.scname = params.get('scname');
      this.pid = params.get('pid');
      /*this.subscription = this._productListRouteInfo.getCart().subscribe(productRouteInfo => {
        if (productRouteInfo) {
          this.cname = productRouteInfo.cname;
          this.scname = productRouteInfo.scname;
          this.pid = productRouteInfo.productId;
        }
      this.prodListRouteInfo = JSON.parse(sessionStorage.getItem("product_details"));
      this.cname = this.prodListRouteInfo.cname;
      this.scname = this.prodListRouteInfo.scname;
      this.pid = this.prodListRouteInfo.pid;*/

      this.getProductDetailsByid();
      this._productservice.getProductlist(this.cname, this.scname, 'us', 0, 20).subscribe(
        (results: searchreponse) => {
          this.similarProducts = results.responseObjects;
          if (this.similarProducts) {
            this.similarProducts = this.similarProducts.filter(item => item.item_id !== this.pid);
          }
        });
    });
  }

  getProductReviewRatingsById(){
    this._productservice.getProductReviewANdRatingsById(this.pid, 'us', 0, 20).subscribe(
      (results: searchreponse) => {
        this.similarProducts = results.responseObjects;
        if (this.similarProducts) {
          this.similarProducts = this.similarProducts.filter(item => item.item_id !== this.pid);
        }
      });
  }

  getProductReviewRatingsCount(){
    this._productservice.getReviewRagtingsCount(this.pid, 'us').subscribe(
      (results: AuthResopnse2) => {
        if(results.statusCode == 404){
          //404 means till now rating for this product.
          return;
        }
        let productReviewRatingCount = results.responseObjects;
        let countsJson: any = JSON.stringify(productReviewRatingCount);
        this.OneStar = countsJson.one? countsJson.one: 0;
        this.TwoStar = countsJson.two? countsJson.two:0;
        this.ThreeStar = countsJson.three? countsJson.three: 0;
        this.FourStar = countsJson.four? countsJson.four:0;
        this.FiveStar = countsJson.five? countsJson.five:0;

        this.OneStarPercent = countsJson.one? this.getRatingPercentage(1, countsJson.one): 0;
        this.TwoStarPercent = countsJson.two? this.getRatingPercentage(2, countsJson.two):0;
        this.ThreeStarPercent = countsJson.three? this.getRatingPercentage(3, countsJson.three): 0;
        this.FourStarPercent = countsJson.four? this.getRatingPercentage(1, countsJson.four):0;
        this.FiveStarPercent = countsJson.five? this.getRatingPercentage(1, countsJson.five):0;
            //    (5*252 + 4*124 + 3*40 + 2*29 + 1*33) / (252+124+40+29+33) = 4.11 and change
        this.totalRating = this.FiveStar + this.FourStar + this.ThreeStar + this.TwoStar + this.OneStar;
        let tempRating : any= ((5*this.FiveStar)+(4*this.FourStar)+(3*this.ThreeStar)+(2*this.TwoStar)+(1*this.OneStar))/this.totalRating;
        this.productRating = tempRating.toFixed(2);
      });
  }

  getRatingPercentage(rating, count) : any{
    let ratingPercent : number= (count*100)/this.totalRating;
    return ratingPercent.toFixed(2);
  }

  getProductDetailsByid() {
    this._productservice.getHttpProductDetailsById(this.cname, this.scname, this.pid, 'us').subscribe(
      (results: searchreponse) => {
        if (results.statusDesc !== 'Unavailable') {
          this.isProductAvailable = true;
        }
        if (results.responseObject) {
          this.items = [];
          //if(results.statusCode ===200){
          this.productDetails = results.responseObject[0];
          this.product = results.responseObject[0];
          if (this.productDetails) {
            let arr = this.productDetails.thumbnail_image;
            if (arr) {
              for (let i = 0; i < arr.length; i++) {
                this.items.push(new ImageItem({ src: arr[i], thumb: arr[i] }));
              }
            } else {
              this.items.push(new ImageItem({ src: this.productDetails.image, thumb: this.productDetails.image }));
            }
            this.loadZoomImagesList();
          }
          let attributes: string = this.productDetails.attributes;
          if (attributes) {
            let arrAtr = attributes.split("\|\|", -1);
            if (arrAtr) {
              for (let attributeInfo of arrAtr) {
                let attrPair = attributeInfo.split(":=", -1);
                this.product_attributes.push(new KeyValuePair(attrPair[0], attrPair[1]));
              }
            }
          }
          if (!this.productDetails.dealtype) {
            this.productDetails.dealtype = '';
          }
          //console.log(this.productDetails);
          this.getProductReviewRatingsCount();
        } else {
          console.log('Product is unavailable' + results);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }


  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }


  loadZoomImagesList() {
    /**
     * https://github.com/MurhafSousli/ngx-gallery/wiki/Lightbox-Usage
     * https://murhafsousli.github.io/ngx-gallery/#/getting-started/core
     * thumbPosition: ThumbnailsPosition.Top,
      itemTemplate: this.itemTemplate,
      gestures: false,
      imageSize: 'cover',
      loadingMode: "indeterminate",
      loadingIcon: 'Loading...'
     */
    this.gallery.resetAll();
    const config: GalleryConfig = {
      loadingMode: "indeterminate"
    };
    this.gallery.ref().setConfig(config);
    this.gallery.ref().load(this.items);
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.height = '450px';
    dialogConfig.panelClass = 'review-popup';
    dialogConfig.data = {
      id: 1,
      title: 'dialog box',
      cname: this.cname,
      scname: this.scname,
      itemid: this.pid,
      masterSuppler: this.productDetails.master_suplier
    };
    this.dialog.open(RateproductComponent, dialogConfig);
  }

  ngAfterViewInit() {
    //   setTimeout(() => {
    //   var galleryThumbs = new Swiper('.gallery-thumbs', {
    //     spaceBetween: 10,
    //     slidesPerView: 4,
    //     freeMode: true,
    //     watchSlidesVisibility: true,
    //     watchSlidesProgress: true,
    //   });
    //   var galleryTop = new Swiper('.gallery-top', {
    //     spaceBetween: 10,
    //     thumbs: {
    //       swiper: galleryThumbs
    //     }
    //   });
    // }, 1000);
  }

  showProductDetails(params) {
    /*let productRouteInfo: ProductRouteInfo = new ProductRouteInfo(params);
    sessionStorage.setItem("product_details", JSON.stringify(productRouteInfo));*/
    // this._productListRouteInfo.addToCart(productRouteInfo);
    this._productservice.routeProductDetails(params);
  }
  funViewReviewRatings(){
    this._router.navigate(['/productratingslist', this.pid ]);
  }
  routeToProductListPage(cname, scname, pid) {
    let params = {
      "cname": cname,
      "scname": scname
      //  "" :pid
    }
    /*let productRouteInfo: ProductRouteInfo = new ProductRouteInfo(params);
   /* this._productListRouteInfo.cname = cname;
    this._productListRouteInfo.scname = scname;
    sessionStorage.setItem("product_list", JSON.stringify(productRouteInfo));*/
    this._productservice.routeProductList(params);
  }

  public addToCart(produt: ProductDetails) {
    // this.product = this.getProductFromDetails(produt);
    this.cartService.addToCart(this.product);
  }

  public quickBuy(produt: ProductDetails) {
    // this.product = this.getProductFromDetails(produt);
    this.cartService.addToCart(this.product);
    this._router.navigateByUrl('/productpurchase');
  }

  public isRecommendThisProduct(isRecommend) {
    try {
      let isProductRecommend = isRecommend ? 'yes' : 'no';
      this._productservice.submitReview(this.userservice.getAuthToken(), this.cname, this.scname, this.pid, 'us',
        '', '', '', this.productDetails.master_suplier, isProductRecommend)
        .subscribe(
          (authResponse: AuthResopnse) => {
            if (authResponse.statusCode === 200) {
              this.result = authResponse.statusDesc;
              console.log('Success' + JSON.stringify(authResponse));
            } else {
              console.log('Failed' + JSON.stringify(authResponse));
            }
          });
    } catch (error) {
      console.log(error);
    }

  }

  getProductFromDetails(produt: ProductDetails): Product {
    this.product = new Product();
    this.product.category = produt.category;
    this.product.subcategory = produt.subcategory;
    this.product.item_id = produt.item_id + "";
    this.product.master_suplier = produt.master_suplier;
    this.product.prepay_price = (produt.prepay_price != null && produt.prepay_price != undefined) ? parseFloat(produt.prepay_price) : 0;
    this.product.price = produt.price;
    this.product.quantity = (produt.quantity != null && produt.quantity != undefined) ? parseInt(produt.quantity) : 0;
    this.product.ship_cost = (produt.ship_cost != null && produt.ship_cost != undefined) ? parseFloat(produt.ship_cost) : 0;
    this.product.supplier_deal_price = produt.supplier_deal_price;
    this.product.title = produt.title;
    this.product.brand_name = produt.brand_name;
    this.product.custom_price = (produt.custom_price != null && produt.custom_price != undefined) ? parseFloat(produt.custom_price) : 0;
    this.product.date = produt.date;
    this.product.deal_price = produt.deal_price;
    this.product.dealtype = produt.dealtype;
    this.product.description = produt.description;
    this.product.discount = produt.discount;
    this.product.discount_amount = produt.discount_amount;
    this.product.image = produt.image;
    this.product.others = produt.other;
    return this.product;
  }

}
