import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { RateproductComponent } from '../rateproduct/rateproduct.component';
import { Swiper, Navigation, Pagination, Scrollbar, Autoplay, Thumbs } from 'swiper/js/swiper.esm.js';
import { ProductDetails } from 'src/app/models/ProductDetails';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize, GalleryConfig } from '@ngx-gallery/core';
import { UserService } from 'src/app/user.service';
import { CartService } from 'src/app/services/cart.service';
import { KeyValuePair } from 'src/app/models/KeyValuePair';
import { ProductDetailsRouteInfoService } from 'src/app/services/routing-services/product-details-route-info.service';
import { ProductListRouteInfoService } from 'src/app/services/routing-services/product-list-route-info.service';
import { ProductRouteInfo } from 'src/app/models/ProductRouteInfo';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay, Thumbs]);

declare let paypal: any;

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss']
})
export class ProductdetailsComponent implements OnInit , AfterViewInit {

  //https://ngx-gallery-cors-error.stackblitz.io
   //Using loadingMode: 'indeterminate' on the GalleryModule's config worked.
   public PRICE_PREFIX: string = environment.PRICE_PREFIX;
   public authToken: string = "";
  @ViewChild('paypal', { static: true })
  paypalElement: ElementRef;
  paidFor: boolean = false;
  public productDetails : ProductDetails = new ProductDetails();
  public product: Product = new Product();
  public similarProducts : Product[];
  public myThumbnail="https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
  public myFullresImage="https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";
  public cname: string;
  public scname: string;
  public pid: string;
  items: Array<GalleryItem> = [];
  product_attributes: Array<KeyValuePair> =[];
  productRating : number = 5;
  public FiveStar: number = 80;
  public FourStar: number = 40;
  public ThreeStar: number = 30;
  public TwoStar: number = 20;
  public OneStar: number = 10;
  public isProductAvailable : boolean =false;
  subscription : Subscription;
  public whishlist_action_type : string;
  // product = {
  //   price: 0.01,
  //   description: "Kappa",
  //   image_uri: "https://d1k0ppjronk6up.cloudfront.net/products/1529/images_b75_image2_844.jpg",
  //   offer_per: 10,
  //   name: "Kappa Variety Puzzles & Games Book Case Pack 48",
  //   status: "",
  //   brand_name: "Kappa",
  //   master_suplier: "",
  //   actual_price: 0.01,
  //   offer_price: 0.01,
  //   drop_ship_fee: "0.001$",
  //   title: "Kappa Variety Puzzles & Games Book Case Pack 48"
  // }

  constructor(private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog, public gallery: Gallery, public userservice: UserService,private cartService: CartService,
    public _productListRouteInfo:ProductListRouteInfoService,
    public _productDetailsRouteInfo:ProductDetailsRouteInfoService) { 
  }

  ngOnInit() {
    this.authToken = sessionStorage.getItem("access_token");
    /*this._Activatedroute.paramMap.subscribe((params : ParamMap)=> {  
      this.cname=params.get('cname');  
      this.scname=params.get('scname');  
      this.pid=params.get('pid');  
    });*/
    /*this.subscription = this._productListRouteInfo.getCart().subscribe(productRouteInfo => {
      if (productRouteInfo) {
        this.cname = productRouteInfo.cname;
        this.scname = productRouteInfo.scname;
        this.pid = productRouteInfo.productId;
      }*/
    let prodListClickInfo: ProductRouteInfo = JSON.parse(sessionStorage.getItem("product_details"));
    this.cname = prodListClickInfo.cname;
    this.scname = prodListClickInfo.scname;
    this.pid = prodListClickInfo.productId;
     
    this._productservice.getHttpProductDetailsById(this.cname, this.scname, this.pid, 'us').subscribe(
      (results: searchreponse) => {
        if(results.statusDesc !== 'Unavailable'){
          this.isProductAvailable = true;
        }
      if(results.responseObject){
         
       //if(results.statusCode ===200){
        this.productDetails = results.responseObject[0];
        if(this.productDetails){
          let arr=this.productDetails.thumbnail_image;
          if(arr){
            for (let i = 0; i < arr.length; i++) {
              this.items.push(new ImageItem({ src: arr[i], thumb: arr[i] }));
            }
          } else {
            this.items.push(new ImageItem({ src:this.productDetails.image , thumb:this.productDetails.image  }));
//            this.items.push(new ImageItem({ src:'http://localhost:4200/assets/img/DealsBargain-Logo.png' , thumb:'http://localhost:4200/assets/img/DealsBargain-Logo.png'}));
          }
          this.loadZoomImagesList();
        }
        let attributes: string = this.productDetails.attributes; 
        if(attributes){
          let arrAtr = attributes.split("\|\|", -1);
          if(arrAtr){
            for(let attributeInfo of arrAtr){
              let attrPair=attributeInfo.split(":=",-1);
              this.product_attributes.push(new KeyValuePair(attrPair[0],attrPair[1]));
            }
          }
        }
        if(!this.productDetails.dealtype){
          this.productDetails.dealtype ='';
        }
        console.log(this.productDetails);
       }else{
         console.log('Product is unavailable'+results);
       }
      },
      (error) => {
        console.log(error);
      }
    );
    this._productservice.getProductlist(this.cname, this.scname, 'us', 0, 20).subscribe(
        (results: searchreponse) => {
          this.similarProducts = results.responseObjects;
          //console.log("simillar products :",this.similarProducts);
      });
   // }); 
  }

  ngOnDestroy(){
   // this.subscription.unsubscribe();
  }


  loadZoomImagesList() {
    /**
     * thumbPosition: ThumbnailsPosition.Top,
      itemTemplate: this.itemTemplate,
      gestures: false,
      imageSize: 'cover',
      loadingMode: "indeterminate",
      loadingIcon: 'Loading...'
     */
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
    dialogConfig.height = '425px';
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

    setTimeout(() => {
      var swiper = new Swiper('.similar', {
        init:true,
        autoplay: {
          delay: 3000,
        },
        spaceBetween:20,
        speed: 500,
        slidesPerView:5,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      })
    }, 1000);

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

  showProductDetails(params){
    let productRouteInfo: ProductRouteInfo = new ProductRouteInfo(params.cname,params.scname,params.pid);
    sessionStorage.setItem("product_details", JSON.stringify(productRouteInfo));
    //this._productListRouteInfo.addToCart(productRouteInfo);
    this._productservice.routeProductDetails(params);
  }

  routeToProductListPage(params){
    let productRouteInfo: ProductRouteInfo = new ProductRouteInfo(params.cname,params.scname,'');
   /* this._productListRouteInfo.cname = cname;
    this._productListRouteInfo.scname = scname;*/
    sessionStorage.setItem("product_list", JSON.stringify(productRouteInfo));
    this._productservice.routeProductList(params);
  }

  public addToCart(produt: ProductDetails) {
    this.product = this.getProductFromDetails(produt); 
    this.cartService.addToCart(this.product);
  }

  public quickBuy(produt :ProductDetails){
    this.product = this.getProductFromDetails(produt); 
    this.cartService.addToCart(this.product);
    this._router.navigateByUrl('/productpurchase');
  }

  getProductFromDetails(produt :ProductDetails) :Product{
    this.product = new Product();
    this.product.category = produt.category;
    this.product.subcategory  = produt.subcategory;
    this.product.item_id = produt.item_id+"";
    this.product.master_suplier = produt.master_suplier;
    this.product.prepay_price  = (produt.prepay_price != null && produt.prepay_price != undefined ) ? parseFloat(produt.prepay_price) : 0;
    this.product.price = produt.price;
    this.product.quantity = (produt.quantity != null && produt.quantity != undefined ) ? parseInt(produt.quantity) : 0;
    this.product.ship_cost = (produt.ship_cost != null && produt.ship_cost != undefined ) ? parseFloat(produt.ship_cost) : 0;
    this.product.supplier_deal_price =produt.supplier_deal_price;
    this.product.title = produt.title;
    this.product.brand_name = produt.brand_name;
    this.product.custom_price = (produt.custom_price != null && produt.custom_price != undefined ) ? parseFloat(produt.custom_price) : 0;
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
