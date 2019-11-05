import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Product } from 'src/app/models/product';
import { searchreponse } from 'src/app/models/searchResponse';
import { RateproductComponent } from '../rateproduct/rateproduct.component';
import { Swiper, Navigation, Pagination, Scrollbar, Autoplay, Thumbs } from 'swiper/js/swiper.esm.js';
import { ProductDetails } from 'src/app/models/ProductDetails';
import { Gallery, GalleryItem, ImageItem, ThumbnailsPosition, ImageSize } from '@ngx-gallery/core';
Swiper.use([Navigation, Pagination, Scrollbar, Autoplay, Thumbs]);

declare let paypal: any;

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductdetailsComponent implements OnInit {

  //https://ngx-gallery-cors-error.stackblitz.io
   //Using loadingMode: 'indeterminate' on the GalleryModule's config worked.

  @ViewChild('paypal', { static: true })
  paypalElement: ElementRef;
  paidFor: boolean = false;
  public productDetails : ProductDetails = new ProductDetails();
  public similarProducts : Product[];
  public myThumbnail="https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg";
  public myFullresImage="https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg";
  public cname: string;
  public scname: string;
  public pid: string;
  items: Array<GalleryItem> = [];
  productRating : number = 5;
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

  constructor(private _Activatedroute: ActivatedRoute, public _productservice: ProductService, public _router: Router, public dialog: MatDialog, public gallery: Gallery) { }

  ngOnInit() {
    this._Activatedroute.paramMap.subscribe((params : ParamMap)=> {  
      this.cname=params.get('cname');  
      this.scname=params.get('scname');  
      this.pid=params.get('pid');  
    }); 
    
    this._productservice.getHttpProductDetailsById(this.cname, this.scname, this.pid, 'us').subscribe(
      (results: searchreponse) => {
        this.productDetails = results.responseObject[0];
        if(this.productDetails){
          let arr=this.productDetails.thumbnail_image;
          if(arr){
            for (let i = 0; i < arr.length; i++) {
              //this.items.push(new ImageItem({ src: arr[i].srcUrl, thumb: arr[i].previewUrl }))
              this.items.push(new ImageItem({ src: arr[i], thumb: arr[i] }));
            }
          } else {
            this.items.push(new ImageItem({ src:this.productDetails.image , thumb:this.productDetails.image  }));
            this.items.push(new ImageItem({ src:'http://localhost:4200/assets/img/DealsBargain-Logo.png' , thumb:'http://localhost:4200/assets/img/DealsBargain-Logo.png'}));
            
          }
          this.loadZoomImagesList();
        }
        //this.productDetails.thumbnail_image=['https://d1k0ppjronk6up.cloudfront.net/products/1529/images_b75_image2_844.jpg',this.productDetails.image];
      },
      (error) => {
        console.log(error);
      }
    );
    this._productservice.getProductlist(this.cname, this.scname, 'us', 0, 20).subscribe(
        (results: searchreponse) => {
          this.similarProducts = results.responseObjects;
      });
      
  }

  loadZoomImagesList() {
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
        title: 'dialog box'
    };
    this.dialog.open(RateproductComponent, dialogConfig);
  }
  
  ngAfterViewInit() {

    setTimeout(() => {
      var swiper = new Swiper('.similar', {
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

      setTimeout(() => {
      var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
      });
      var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        // },
        thumbs: {
          swiper: galleryThumbs
        }
      });
    }, 1000);
  }

  showProductDetails(params){
    this._productservice.routeProductDetails(params);
  }

}
